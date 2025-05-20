import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ILoginResponse, IRefreshToken } from "../interface/auth.if";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenData  implements IRefreshToken {
    constructor(tokenObj:any = undefined, jwt:JwtService | undefined = undefined){
        console.log('object:', {...tokenObj})
        if (tokenObj) {
          const opt:JwtSignOptions = {
            // secret: process.env.API_KEY,
            // mutatePayload: true,
            // expiresIn: '5m',
          }
          const optR:JwtSignOptions = {
            secret: process.env.REFRESH_KEY,
            // mutatePayload: true,
            //expiresIn: '5m',
          }
          console.log("jwt check1");
          this.token = jwt.sign({...tokenObj}, opt);
          this.refreshToken = jwt.sign({...tokenObj}, optR);
          // if (deviceObj) this.deviceRefreshToken = jwt.sign({...deviceObj}, optD);
          console.log("jwt check2");
        }
        // delete this.jwt;
      }
      @ApiProperty({
        description: 'JWT Token',
        example: 'eyJhbGciOiJIUzI1NiJ9.dGhpcyBpcyBhIHRlc3Qga2V5.8mtRPFb-V9iKAFQ4DFNgOVfDPk5EM-FY173zw-xHDyE',
      })
      @IsString()
      token: string;
    
      @ApiProperty({
          description: 'Refresh Token',
          example: 'eyJhbGciOiJIUzI1NiJ9.dGhpcyBpcyBhIHJlZnJlc2gga2V5.EaUzFaSVHMOdp-AMFugBbmnzAWuleFGLVyazgPMLgXE',
      })
      @IsString()
      refreshToken?: string;
}