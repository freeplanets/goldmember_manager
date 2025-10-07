import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";
import { TokenErrorException } from "./token-error-exception";
import { ErrCode } from "../enumError";
import { InjectModel } from "@nestjs/mongoose";
import { LoginToken, LoginTokenDocument } from "../../dto/schemas/login-token.schema";
import { Model } from "mongoose";

@Injectable()
export class TokenGuard implements CanActivate {
    constructor(
        @InjectModel(LoginToken.name) protected readonly loginTokenModel: Model<LoginTokenDocument>,
        protected jwt:JwtService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return this.verifyToken(context);
    }

    async verifyToken(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFormHeader(request);
        // console.log('check1 token:', token);
        if (!token) {
            console.log('check2');
            //throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.TOKEN_ERROR);
        }

        let isLogin:any;
        try {
            isLogin = await this.checkLogin(token);
            // console.log('isLogin:', isLogin);    
        } catch (e) {
            console.log('check2:', e);
            //throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.TOKEN_ERROR);
        }
        if (!isLogin) {
            console.log('logout');
            // throw new UnauthorizedException();
            throw TokenErrorException(ErrCode.BEEN_LOGOUT);
        }        
        try {
            // console.log('check3', process.env.API_KEY);
            const payload = this.jwt.verify(
                token,
                {
                    secret: process.env.API_KEY,
                }
            )
            // console.log('payload:', payload);
            request['user'] = payload;
            request['token'] = token;
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
    protected extractTokenFormHeader(request:Request): string | undefined {
        //const [type, token] = request.headers.authorization?.split(' ') ?? [];
        //console.log('extractTokenFromHeader:', request.headers.authorization);
        // console.log('headers', request.headers);
        const token =  request.header('WWW-AUTH') || request.header('Authorization');
        //const token =  request.header('Authorization');
        // console.log('extractTokenFromHeader:', token);
        if (token && (token.startsWith('Bearer ') || token.startsWith('bearer '))) {
            return token.slice(7); // Remove "Bearer " prefix
        }
        // console.log('extractTokenFromHeader:', token);
        return token ? token : undefined;
    }
    async checkLogin(token:string) {
        const u = this.jwt.decode(token);
        return await this.loginTokenModel.findOne({uid: u['id'], token: token});    
    }
}