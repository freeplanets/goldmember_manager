import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ILoginResponse } from '../interface/auth.if';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export class LoginResponseData implements ILoginResponse {
  // private jwt = new JwtService();
  constructor(tokenObj:any = undefined, jwt:JwtService | undefined = undefined){
    console.log('object:', {...tokenObj})
    if (tokenObj) {
      const opt:JwtSignOptions = {
        // secret: process.env.API_KEY,
        // mutatePayload: true,
        // expiresIn: '1h',
      }
      const optR:JwtSignOptions = {
        secret: process.env.REFRESH_KEY,
        // mutatePayload: true,
        expiresIn: '30 days',
      }
      this.token = jwt.sign({...tokenObj}, opt);
      this.refreshToken = jwt.sign({...tokenObj}, optR);  
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

  @ApiProperty({
    description: 'Image tag from goole authenticator, 首登入產生',
    example: "<a title='Manually pair with LFFE6OCMINIVITKGKU2A' href='https://www.authenticatorapi.com'><img src='https://www.AuthenticatorAPI.com/qr.aspx?size=300x300&data=otpauth%3A%2F%2Ftotp%2Fjames%3Fsecret%3DLFFE6OCMINIVITKGKU2A%26issuer%3Dgoldmember_manager' border=0></a>"
  })
  @IsString()
  gaIMG?: string;
}
