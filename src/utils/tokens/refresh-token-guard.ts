import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenGuard } from "./token-guard";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { TokenErrorException } from "./token-error-exception";
import { ErrCode } from "../enumError";
import { LoginToken, LoginTokenDocument } from "../../dto/schemas/login-token.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RefreshTokenGuard extends TokenGuard {
    constructor(
        @InjectModel(LoginToken.name) protected readonly loginTokenModel: Model<LoginTokenDocument>,
        private jwtR:JwtService){
        super(loginTokenModel,jwtR);
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPassVerify = await this.verifyToken(context);
        if (isPassVerify) {
            const request = context.switchToHttp().getRequest();
            const { refreshToken } = request.body;
            // console.log('refreshToken:', refreshToken);
            if (!refreshToken) {
                //throw new UnauthorizedException();
                throw TokenErrorException(ErrCode.TOKEN_ERROR);
            }
            try {
                //console.log('check3', process.env.REFRESH_KEY);
                const payload = this.jwtR.verify(
                    refreshToken,
                    {
                        secret: process.env.REFRESH_KEY,
                    }
                )
                if (!payload) {
                    //throw new UnauthorizedException();
                    throw TokenErrorException(ErrCode.TOKEN_ERROR);
                }
                //console.log('payload:', payload);
                //request['refresh'] = payload;
            } catch (e) {
                // console.log('check4:', err); 
                //throw new UnauthorizedException();
                if (e instanceof TokenExpiredError ) { 
                    throw TokenErrorException(ErrCode.TOKEN_EXPIRED);
                } else {
                    throw TokenErrorException(ErrCode.TOKEN_ERROR);
                }
            }
            return true;    
        }
    }
}