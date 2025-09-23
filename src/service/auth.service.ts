import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PASSWORD_RETRY_COUNT, PASSWORD_RETRY_TIME, VERIFY_CODE_MESSAGE } from '../utils/constant';
import { AuthLoginRequestDto } from '../dto/auth/auth-login-request.dto';
import { AuthResetPasswordRequestDto } from '../dto/auth/auth-reset-password-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../dto/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '../dto/interface/user.if';
import { LoginResponseData } from '../dto/auth/login-response.data';
import GoogleAuth, { IGAValidate, IParamForGoogleAuth } from '../utils/GoogleAuth';
import { JwtService } from '@nestjs/jwt';
import { USER_DEFAULT_FIELDS } from '../utils/base-fields-for-searh';
import { OtpCode } from '../utils/otp-code';
import { AuthSMSRequestDto } from '../dto/auth/auth-sms-request.dto';
import * as svgCaptcha from "svg-captcha";
import { sendSMSCode, verifyPhoneCode } from '../utils/sms';
import { ErrCode } from '../utils/enumError';
import { AuthLoginResponseDto } from '../dto/auth/auth-login-response.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { TempData, TempDataDocument } from '../dto/schemas/tempdata.schema';
import { AuthSendVerificationResponseDto } from '../dto/auth/auth-send-verification-response.dto';
import { ITempData } from '../dto/interface/common.if';
import { LoginToken, LoginTokenDocument } from '../dto/schemas/login-token.schema';
import { ILoginToken } from '../dto/interface/auth.if';
import { SmsCodeUsage } from '../utils/enum';
import { ILoginDevice } from '../dto/interface/devices.if';
import { AuthRefreshTokenResponse } from '../dto/auth/auth-refresh-token-response';
import { RefreshTokenData } from '../dto/auth/refresh-token-data';
import { MemberActivity, MemberActivityDocument } from '../dto/schemas/member-activity.schema';

const GA = new GoogleAuth();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly modelUser:Model<UserDocument>,
    @InjectModel(TempData.name) private readonly modelTempData:Model<TempDataDocument>,
    @InjectModel(LoginToken.name) private readonly modelLoginToken:Model<LoginTokenDocument>,
    @InjectModel(MemberActivity.name) private readonly modelMA:Model<MemberActivityDocument>,
    private readonly jwt: JwtService,
  ){}
  async authLogin( authLoginRequestDto: AuthLoginRequestDto, ip:string): Promise<AuthLoginResponseDto> {
    const alRes = new AuthLoginResponseDto();
    console.log("alRes:", alRes);
    try {
      const device = this.jwt.decode(authLoginRequestDto.fingerprint);
      console.log('fingerprint:', authLoginRequestDto.fingerprint);
      console.log('device', device);
      // fingerprint check
      if (!device.deviceId) {
        alRes.ErrorCode = ErrCode.ERROR_PARAMETER;
        alRes.error.extra = 'fingerprint error, deviceId not found';
        return alRes;
      }
      const user = await this.modelUser.findOne(
        {username: authLoginRequestDto.username},
        `${USER_DEFAULT_FIELDS} password has2Fa SecretCode isLocked passwordFailedCount passwordLastTryTs devices`,
      );
      console.log('user:', user, authLoginRequestDto);
      if (user) {
        if (!user.isActive) {
          alRes.ErrorCode = ErrCode.ACCOUNT_IS_NOT_ACTIVATED;
          return alRes;
        }
        if (user.isLocked) {
          alRes.ErrorCode = ErrCode.ACCOUNT_IS_LOCKED;
          return alRes;
        }
        const rltOk = await user.schema.methods.comparePassword(authLoginRequestDto.password, user.password);
        console.log("check pass:", rltOk);
        if (rltOk) {
          const userInfo:Partial<IUser> = {};
          userInfo.id = user.id;
          userInfo.username = user.username;
          userInfo.displayName = user.displayName;
          userInfo.role = user.role;
          userInfo.authRole = user.authRole;
          userInfo.phone = user.phone;
          userInfo.has2Fa = user.has2Fa;
          userInfo.lastLogin = user.lastLogin;
          userInfo.lastLoginIp = user.lastLoginIp;
          userInfo.lastLoginDevice = user.lastLoginDevice;
          if (userInfo.lastLoginDevice && userInfo.lastLoginDevice.deviceId) {
            delete userInfo.lastLoginDevice.deviceId;
          }
          // console.log("find user:", userInfo);
          // fingerprint re object
          const loginD:Partial<ILoginDevice> = {}
          Object.keys(device).forEach((key) => {
            if (key !== 'iat' && key !== 'exp' && key !== 'deviceId') {
              loginD[key] = device[key];
            }
          });
          const res =  new LoginResponseData(userInfo, this.jwt, loginD);
          const loginTime = Date.now();
          loginD.lastLogin = loginTime;
          loginD.lastLoginIp = ip;          
          loginD.deviceId = device.deviceId;
          const oldDevices = user.devices ? user.devices  : [];
          let fIdx = oldDevices.findIndex((itm) => itm.deviceId === loginD.deviceId);
          if (fIdx !== -1) {
            //f = loginD;
            oldDevices[fIdx] = loginD;
          } else {
            oldDevices.push(loginD);
          }
          const upsert = await this.modelLoginToken.updateOne(
            {uid:user.id}, 
            {token: res.token}, 
            {upsert:true}
          );
          console.log("upsert:", upsert);
          const updev = await this.modelLoginToken.updateOne(
            {uid: loginD.deviceId},
            {token: res.deviceRefreshToken, lastLoginId: user.id },
            {upsert: true},
          );
          console.log('updev:', updev);
          if (!user.has2Fa) { // 未設定二階段認證
            res.totpIMG = await this.twoFaSelf(user);
            alRes.data = res;
          } else {
            const otp = new OtpCode();
            const chk = otp.verify(authLoginRequestDto.totpCode, user.SecretCode);
            console.log('totp chk:', chk);
            if (!chk){
              alRes.ErrorCode = ErrCode.VERIFY_CODE_ERROR;
            } else {
              alRes.data = res;
            }
          }
          await this.modelUser.findByIdAndUpdate(user._id, 
            {
              lastLogin: loginTime, 
              lastLoginIp:ip,
              lastLoginDevice: loginD,
              devices: oldDevices,
              passwordFailedCount: 0,
              passwordLastTryTs: 0,
            });
          // console.log('token:', new JwtService().decode(res.token));
          // alRes.data = res;
        } else {
          let passwordLastTryTs = user.passwordLastTryTs ? user.passwordLastTryTs : 0;
          let passwordFailedCount = user.passwordFailedCount ? user.passwordFailedCount : 0;
          if (passwordLastTryTs === 0) {
            passwordLastTryTs = new Date().getTime();
          } else {
            const now = new Date().getTime();
            if (now - passwordLastTryTs > PASSWORD_RETRY_TIME) {
              passwordFailedCount = 0;
              passwordLastTryTs = now;
            }
          }
          passwordFailedCount++;
          const updta:Partial<IUser> = {
            passwordFailedCount,
            passwordLastTryTs,
          }
          if (passwordFailedCount >= PASSWORD_RETRY_COUNT) {
            updta.isLocked = true;
          }
          const upd = await this.modelUser.findOneAndUpdate({id:user.id}, updta);
          console.log("update pass", upd);
          alRes.ErrorCode = ErrCode.ACCOUNT_OR_PASSWORD_ERROR;
        }
      } else {
        alRes.ErrorCode = ErrCode.ACCOUNT_OR_PASSWORD_ERROR;
      }
    } catch (e) {
      console.log('authLogin error:', e);
      alRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      alRes.error.extra = e.message;
      // throw new CommonError(
      //   e.type || ERROR_TYPE.SYSTEM,
      //   e.status || STATUS_CODE.FAIL,
      //   e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
      //   e.message,
      // );
    }
    return alRes;
  }
  async verify2Fa(user:Partial<IUser>,totpCode: string):Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      let chk = false;
      const usr = await this.modelUser.findOne({id: user.id}, 'has2Fa SecretCode');
      // console.log('usr', usr);
      if (user) {
        // if (!usr.SecretCode) {
        //   console.log('miss SecretCode!!!');
        //   return false;
        // }
        const otp = new OtpCode();
        chk = otp.verify(totpCode, usr.SecretCode);
        console.log('upd 2fa', chk);
        if (chk){
          if (!usr.has2Fa) {
            const upd = await this.modelUser.findByIdAndUpdate(usr._id, {has2Fa: true});
            // console.log('upd 2fa', upd);
            if (!upd) {
              comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
              //return false;
            }
          }
        } else {
          comRes.ErrorCode = ErrCode.VERIFY_CODE_ERROR;
        }
      } else {
        comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async authResetPassword(
    authResetPassword: AuthResetPasswordRequestDto,
  ): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const f = await this.modelTempData.findOne({code: authResetPassword.phone});
      if (f) {
        if (f.ts + 60*3*1000 < Date.now()) {
          comRes.ErrorCode = ErrCode.SMS_TOO_LATE;
        } else if (
          f.codeUsage === SmsCodeUsage.RESET_PASS &&
          f.value === authResetPassword.verificationCode 
        ) { 
          const upd = await this.modelUser.updateOne(
            { phone: authResetPassword.phone }, 
            {
              password: authResetPassword.newPassword,
              passwordFailedCount: 0,
              isLocked: false,
              passwordLastTryTs: 0,
            });
            console.log("update pass", upd);
  
            // if (upd) {
            //   const del = await this.modelTempData.deleteOne({code: phone});
            //   console.log("delete:", del);
            // }
        } else {
          comRes.ErrorCode = ErrCode.VERIFY_CODE_ERROR;
        }
      }  else {
        comRes.ErrorCode = ErrCode.PHONE_ERROR;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async authRefreshToken(req:Request):Promise<AuthRefreshTokenResponse> {
    const alRes = new AuthRefreshTokenResponse();
    try {
      const { user } = req as any;
      // console.log("user:", user);
      delete user.exp;
      delete user.iat;
      // const ans = this.jwt.sign(user);
      // console.log('decode:', this.jwt.decode(ans));
      if (user.iat) delete user.iat;
      if (user.exp) delete user.exp;
      const ans = new RefreshTokenData(user, this.jwt);
      if (ans) {
        alRes.data = ans
        const upsert = await this.modelLoginToken.updateOne({uid:user.id}, {token: ans.token}, {upsert:true});
        console.log("upsert:", upsert);
      } else {
        alRes.ErrorCode = ErrCode.TOKEN_ERROR;
      }
    } catch (e) {
      alRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      alRes.error = {
        extra: e,
      }
    }  
    return alRes;  
  }
  
  async authDeviceRefreshToken(req:Request):Promise<AuthLoginResponseDto> {
    const alRes = new AuthLoginResponseDto();
    try {
      const { user, device } = req as any;
      const loginD:Partial<ILoginDevice> = {};
      Object.keys(device).forEach((key) => {
        if (key!== 'iat' && key !=='exp') {
          loginD[key] = device[key];
        }
      })
      const fnd = await this.modelUser.findOne({id: user.id}, `${USER_DEFAULT_FIELDS} has2Fa isLocked isActive`);
      if (fnd) {
        if (!fnd.isActive) {
          alRes.ErrorCode = ErrCode.ACCOUNT_IS_NOT_ACTIVATED;
          return alRes;
        }
        if (fnd.isLocked) {
          alRes.ErrorCode = ErrCode.ACCOUNT_IS_LOCKED;
          return alRes;
        }
        const userInfo:Partial<IUser> = {};
        userInfo.id = fnd.id;
        userInfo.username = fnd.username;
        userInfo.displayName = fnd.displayName;
        userInfo.role = fnd.role;
        userInfo.authRole = fnd.authRole;
        userInfo.phone = fnd.phone;
        userInfo.has2Fa = fnd.has2Fa;
        userInfo.lastLogin = fnd.lastLogin;
        userInfo.lastLoginIp = fnd.lastLoginIp;
        userInfo.lastLoginDevice = fnd.lastLoginDevice;
        const ans = new LoginResponseData(userInfo, this.jwt, loginD);
        if (ans) {
          alRes.data = ans
          const upsert = await this.modelLoginToken.updateOne({uid:user.id}, {token: ans.token}, {upsert:true});
          console.log("upsert:", upsert);
        } else {
          alRes.ErrorCode = ErrCode.TOKEN_ERROR;
        }
      } else {
        alRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      }
    } catch (e) {
      alRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      alRes.error = {
        extra: e,
      }
    }  
    return alRes;  
  }
  async getCaptcha(forTest=false):Promise<AuthSendVerificationResponseDto> {
    const verifyRes = new AuthSendVerificationResponseDto();
    try {
      const opt:svgCaptcha.ConfigObject = {
        size: 4,
        fontSize: 50,
        width: 110,
        height: 40,
        ignoreChars: '0o1liI',
        background: '#cc9966',
      }
      const captcha = svgCaptcha.create(opt);
      const captchaId = Math.floor(Math.random() * 1000000000).toString();
      console.log("Generated Random ID:", captchaId);
      const tmp:ITempData = {
        code: captchaId,
        value: captcha.text,
        ts: new Date().getTime(),  
      }
      const f = await this.modelTempData.findOne({code: tmp.code});
      console.log("findOne:", f);
      if (f) {
        await this.modelTempData.deleteOne({code: tmp.code});
      }
      const tmpData = await this.modelTempData.create(tmp);
      if (tmpData) {
        verifyRes.data = {
          captcha: captcha.data,
          captchaId,
        }
        if (forTest) {
          if (!verifyRes.error) verifyRes.error = {};
          verifyRes.error.extra = captcha.text;
        }        
      } else {
        verifyRes.ErrorCode = ErrCode.CAPTCHA_ERROR;
      }
    } catch (e) {
      verifyRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      verifyRes.error.extra = e;
    }
    return verifyRes    
  }
  async sendSmsCode(smsReq:AuthSMSRequestDto, forTest=false):Promise<CommonResponseDto>{
    const comRes = new CommonResponseDto();
    try {
      const f = await this.modelTempData.findOne({code: smsReq.captchaId});
      if (f && f.value === smsReq.captchaCode && (f.ts + 60*3*1000 > new Date().getTime())) {
        let phone = smsReq.phone.indexOf('#')>0 ? smsReq.phone.split('#')[0] : smsReq.phone;
        phone = verifyPhoneCode(phone);
        const oldData = await this.modelTempData.findOne({code: smsReq.phone});
        if (oldData) {
          if(oldData.ts + 60*3*1000 > new Date().getTime()) {
            comRes.ErrorCode = ErrCode.SMS_CODE_TOO_FAST;
            return comRes
          }
        }
        const otp = new OtpCode();
        const secret = otp.SecretCode;
        const verifyCode = otp.getToken(secret);
        const tmp:ITempData = {
          // code: phone,
          value: verifyCode,
          codeUsage: smsReq.codeUsage,
          ts: new Date().getTime(),  
        }
        const ans = await this.modelTempData.updateOne({code: smsReq.phone}, tmp, {upsert:true});
        console.log("save verifyCode", ans);
        // if (!ans) {
        //   comRes.ErrorCode = ErrCode.SMS_SEND_ERROR;
        //   return comRes;
        // }
        const msg = VERIFY_CODE_MESSAGE.replace('{CODE}', verifyCode);
        let rlt:any;
        if (forTest) {
          rlt = true;
        } else {
          console.log('sendSmsCode phone:', phone);
          rlt = await sendSMSCode(phone, msg);
        }
        //const rlt = await sendSMSCode(phone, msg);
        // console.log('sendSMSCode', rlt);
        if (!rlt) comRes.ErrorCode = ErrCode.SMS_SEND_ERROR;
        else {
          if(forTest) {
            if (!comRes.error) comRes.error = {};
            comRes.error.extra = verifyCode;
          }
          const del = await this.modelTempData.deleteOne({code: smsReq.captchaId});
          console.log("delete:", del);
        }
      } else {
        comRes.ErrorCode = ErrCode.CAPTCHA_ERROR;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async twoFaSelf(user:Partial<IUser>) {
    let appName = process.env.SYS_NAME;
    if (process.env.IS_OFFLINE) appName = `${appName}_local`;
    const otp:OtpCode = new OtpCode();
    const secret = otp.SecretCode;
    const ans = await otp.getImg(secret, appName, user.username);
    // console.log('twoFaSelf:', secret)
    if (ans) {
      const upd = await this.modelUser.findOneAndUpdate({id: user.id}, {SecretCode: secret});
      if (upd) {
        return ans;
      }
    }
    return undefined;
  }
  async twoFaSetup(user:Partial<IUser>, session:any) {
    let appName = process.env.SYS_NAME;
    if (process.env.IS_OFFLINE) appName = `${appName}_local`;
    const gaParam: IParamForGoogleAuth = {
      AppName: appName,
      AppInfo: user.username,
      SecretCode: GA.SecretCode,
    };
    console.log('gaParam:', gaParam);
    const ans = await GA.getIMG(gaParam);
    if (ans) {
      session.SecretCode = gaParam.SecretCode;
      // user will be update at frist using Ga code
      // const updateUser:Partial<IUser> = {
      //   has2Fa: true,
      //   SecretCode: gaParam.SecretCode,
      // }
      // const rlt = await this.modelUser.findByIdAndUpdate(user._id, updateUser);
      // console.log(':', rlt);
      return ans;
    } else {
      return undefined;
    }
  }
  gaValidate(gav:IGAValidate) {
    return GA.Validate(gav);
  }
  async logout(user:Partial<IUser>){
    const comRes = new CommonResponseDto();
    try {
      if (user) {
        const data:Partial<ILoginToken> = {
          token: '',
        }
        const ans = await this.modelLoginToken.updateOne({uid:user.id}, data);
        console.log('logout user', ans);
        const dev = await this.modelLoginToken.updateOne({lastLoginId: user.id}, data);
        console.log('logout dev', dev);
      } else {
        comRes.ErrorCode = ErrCode.TOKEN_ERROR;
      }
    } catch(e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
}
