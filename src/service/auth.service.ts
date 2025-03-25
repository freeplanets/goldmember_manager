import { Injectable, InjectableOptions } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { AuthLoginRequestDto } from '../dto/auth/auth-login-request.dto';
import { AuthResetPasswordRequestDto } from '../dto/auth/auth-reset-password-request.dto';
import { AuthSendVerificationRequestDto } from '../dto/auth/auth-send-verification-request.dto';
import { ILoginResponse } from '../dto/interface/auth.if';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../dto/schemas/user.schema';
import { Model } from 'mongoose';
import { IUser } from '../dto/interface/user.if';
import { LoginResponseData } from '../dto/data/login-response.data';
import { UserCreateDataDto } from '../dto/users/user-create-data.dto';
import GoogleAuth, { IGAValidate, IParamForGoogleAuth } from '../utils/GoogleAuth';
import { JwtService } from '@nestjs/jwt';
import { USER_DEFAULT_FIELDS } from '../utils/base-fields-for-searh';

const GA = new GoogleAuth();

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly modelUser:Model<UserDocument>,
    private readonly jwt: JwtService,
  ){}
  async authLogin( authLoginRequestDto: AuthLoginRequestDto, ip:string ): Promise<any> {
    //try {
      const user = await this.modelUser.findOne(
        {username: authLoginRequestDto.username},
        `${USER_DEFAULT_FIELDS} need2changePass password has2Fa SecretCode`,
      );
      console.log("find user:", user);
      // console.log('sign:', this.jwt.sign({...user}));
      if (user) {
        const rltOk = await user.schema.methods.comparePassword(authLoginRequestDto.password, user.password);
        console.log("check pass:", rltOk);
        if (rltOk) {
          const userInfo:UserCreateDataDto = new UserCreateDataDto();
          userInfo.id = user.id;
          userInfo.username = user.username;
          userInfo.displayName = user.displayName;
          userInfo.role = user.role;
          userInfo.authRole = user.authRole;
          userInfo.phone = user.phone;
          userInfo.need2changePass = user.need2changePass;
          let res:LoginResponseData;
          if (!user.has2Fa) { // 未設定二階段認證
            res = new LoginResponseData();
            res.gaIMG = await this.twoFaSetup(user);
          } else {
            const gav = await this.gaValidate({ Pin: authLoginRequestDto.totpCode, SecretCode: user.SecretCode});
            console.log('gav', gav);
            if (gav === 'True'){
              res = new LoginResponseData(userInfo, this.jwt);              
            } else {
              return false;
            }
          }
          await this.modelUser.findByIdAndUpdate(user._id, {lastLogin:new Date().toLocaleString("zh-TW"), lastLoginIp:ip});
          // console.log('token:', new JwtService().decode(res.token));
          return res;
        }
      }
      return false;
    // } catch (e) {
    //   throw new CommonError(
    //     e.type || ERROR_TYPE.SYSTEM,
    //     e.status || STATUS_CODE.FAIL,
    //     e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
    //     e.message,
    //   );
    // }
  }

  async authResetPassword(
    authResetPasswordRequestDto: AuthResetPasswordRequestDto,
    req: Request,
  ): Promise<any> {
    try {
      const usr = await this.modelUser.findOne({phone: authResetPasswordRequestDto.phone});
      if (usr) {
        const ans = await this.gaValidate({
          Pin: authResetPasswordRequestDto.verificationCode,
          SecretCode: usr.SecretCode,
        });
        if (ans === 'True') {
          const upd = await this.modelUser.findOneAndUpdate(
            {id: usr.id}, 
            {
              password: authResetPasswordRequestDto.newPassword
            }
          );
          console.log("update pass", upd);
        }
        return ans;
      }
      return false;
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async authSendVerification(
    authSendVerificationRequestDto: AuthSendVerificationRequestDto,
    req: Request,
  ): Promise<any> {
    try {
      const usr = await this.modelUser.findOne({phone: authSendVerificationRequestDto.phone});
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }
  authRefreshToken(req:Request):string|boolean {
    try {
      const { user } = req as any;
      console.log("user:", user);
      delete user.exp;
      delete user.iat;
      const ans = this.jwt.sign(user);
      console.log('decode:', this.jwt.decode(ans));
      if (ans) {
        return ans;
      }
      return false;
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }    
  }
  async twoFaSetup(user:Partial<IUser>) {
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
      const updateUser:Partial<IUser> = {
        has2Fa: true,
        SecretCode: gaParam.SecretCode,
      }
      const rlt = await this.modelUser.findByIdAndUpdate(user._id, updateUser);
      console.log('update user:', rlt);
      return ans;
    } else {
      return undefined;
    }
  }
  gaValidate(gav:IGAValidate) {
    return GA.Validate(gav);
  }
}
