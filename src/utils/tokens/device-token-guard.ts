import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenErrorException } from './token-error-exception';
import { ErrCode } from '../enumError';
import { InjectModel } from '@nestjs/mongoose';
import { LoginToken, LoginTokenDocument } from '../../dto/schemas/login-token.schema';
import { Model } from 'mongoose';
import { TokenGuard } from './token-guard';
import { ILoginToken } from '../../dto/interface/auth.if';

@Injectable()
export class DeviceTokenGuard extends TokenGuard {
    constructor(
        @InjectModel(LoginToken.name) loginTokenModel: Model<LoginTokenDocument>,
        jwt:JwtService,
    ){
        super(loginTokenModel, jwt);
    }

    async verifyToken(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFormHeader(request);
        const deviceId = request.body.deviceid;
        console.log('deviceId:', deviceId);
        console.log('dtoken:', token)
        if (!token) {
            console.log('check2');
            //throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.TOKEN_ERROR);
        }

        let isLogin:Partial<ILoginToken>;
        try {
            isLogin = await this.checkDeviceLogin(deviceId, token);
            // console.log('isLogin:', isLogin);    
        } catch (e) {
            console.log('check2:', e);
            //throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.TOKEN_ERROR);
        }
        if (!isLogin) {
            console.log('dtg check logout', isLogin);
            // throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.BEEN_LOGOUT);
        }        
        try {
            // console.log('check3', process.env.API_KEY);
            const payload = this.jwt.verify(
                token,
                {
                    secret: process.env.DEVICE_KEY,
                }
            )
            // console.log('payload:', payload);
            // request['user'] = payload;
            request['device'] = payload;
            request['user'] = { id: isLogin.lastLoginId }
        } catch (e) {
            if (e instanceof TokenExpiredError ) {
            // throw new UnauthorizedException();
                throw TokenErrorException(ErrCode.TOKEN_EXPIRED);
            } else {
                // throw new UnauthorizedException();
                throw TokenErrorException(ErrCode.TOKEN_ERROR)
            }

        }
        return true;
    }

    async checkDeviceLogin(deviceId:string, token:string):Promise<any> {
        // const u:Partial<ILoginDevice> = this.jwt.decode(token);
        return this.loginTokenModel.findOne({uid: deviceId, token: token});    
    }    
}