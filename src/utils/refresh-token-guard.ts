import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenGuard } from "./token-guard";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RefreshTokenGuard extends TokenGuard {
    constructor(private jwtR:JwtService){
        super(jwtR);
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPassVerify = await this.verifyToken(context);
        if (isPassVerify) {
            const request = context.switchToHttp().getRequest();
            const { refreshToken } = request.body;
            console.log('refreshToken:', refreshToken);
            if (!refreshToken) {
                throw new UnauthorizedException();
            }
            try {
                console.log('check3', process.env.REFRESH_KEY);
                const payload = this.jwtR.verify(
                    refreshToken,
                    {
                        secret: process.env.REFRESH_KEY,
                    }
                )
                if (!payload) {
                    throw new UnauthorizedException();
                }
                //console.log('payload:', payload);
                //request['refresh'] = payload;
            } catch (err) {
                console.log('check4:', err); 
                throw new UnauthorizedException();
            }
            return true;    
        }
    }
}