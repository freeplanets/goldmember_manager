import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class TokenGuard implements CanActivate {
    constructor(private jwt:JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return this.verifyToken(context);
    }

    async verifyToken(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFormHeader(request);
        console.log('check1');
        if (!token) {
            console.log('check2');
            throw new UnauthorizedException();
        }
        try {
            console.log('check3', process.env.API_KEY);
            const payload = this.jwt.verify(
                token,
                {
                    secret: process.env.API_KEY,
                }
            )
            console.log('payload:', payload);
            request['user'] = payload;
        } catch (err) {
            console.log('check4:', err); 
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFormHeader(request:Request): string | undefined {
        //const [type, token] = request.headers.authorization?.split(' ') ?? [];
        //console.log('extractTokenFromHeader:', request.headers.authorization);
        // console.log('headers', request.headers);
        const token =  request.header('WWW-AUTH');
        console.log('extractTokenFromHeader:', token);
        return token ? token : undefined;
    }
}