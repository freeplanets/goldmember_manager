import { Controller, Req, Res, HttpStatus, Post, Body, Get, Ip, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '../dto/auth/auth-login-request.dto';
import { AuthLoginResponseDto } from '../dto/auth/auth-login-response.dto';
import { AuthResetPasswordRequestDto } from '../dto/auth/auth-reset-password-request.dto';
import { AuthSendVerificationRequestDto } from '../dto/auth/auth-send-verification-request.dto';
import { ErrCode, ErrMsg } from '../utils/enumError';
import { CommonResponseDto } from '../dto/common-response.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { TokenGuard } from '../utils/token-guard';
import { RefreshTokenGuard } from '../utils/refresh-token-guard';
import { RefreshTokenDto } from '../dto/auth/auth-refresh-token-request.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '使用者登入',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AuthLoginResponseDto,
  })
  @Post('/login')
  async authLogin(
    @Body() authLoginRequestDto: AuthLoginRequestDto,
    @RealIP() ip: string,
    @Res() res: Response,
  ) {
    console.log("ip:", ip);
    // console.log('forwarded:', forwarded, req.ips, req.ip);
    // const ip = typeof forwarded === 'string' ? forwarded : (forwarded as string[])?.length > 0 ? forwarded[0] : null;
    const ans = new AuthLoginResponseDto();
    const rlt = await this.authService.authLogin(authLoginRequestDto, ip);
    if (rlt) ans.data = rlt;
    else {
      ans.errorcode = ErrCode.ERROR_PARAMETER;
      ans.error = {
        message: ErrMsg.ERROR_PARAMETER,
      };
    }
    console.log("rlt:", rlt);
    return res.status(HttpStatus.OK).json(ans);
  }

  @ApiOperation({
    summary: '重設密碼',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    //type: AuthResetPasswordResponseDto,
    type: CommonResponseDto,
  })
  @UseGuards(TokenGuard)
  @Post('/resetpassword')
  async authResetPassword(
    @Body() authResetPasswordRequestDto: AuthResetPasswordRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ans = await this.authService.authResetPassword(authResetPasswordRequestDto, req);
    const commonRes = new CommonResponseDto(ErrCode.OK);
    if (!ans) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(commonRes);
  }

  // @ApiOperation({
  //   summary: '取得Recaptcha',
  //   description: '',
  // })
  // @Recaptcha({response: req => req.body.recaptha})
  // @Post('Send')
  // getRecaptcha(){
  //   //console.log('getRecaptcha', req.body);
  //   //return res.status(HttpStatus.OK);
  // }

  // @ApiOperation({
  //   summary: '發送驗證碼',
  //   description: '',
  // })
  // @ApiResponse({
  //   description: '成功或失敗',
  //   // type: AuthSendVerificationResponseDto,
  //   example: HttpStatus.OK,
  // })
  // @Post('/sendverification')
  // async authSendVerification(
  //   @Body() authSendVerificationRequestDto: AuthSendVerificationRequestDto,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   await this.authService.authSendVerification(
  //     authSendVerificationRequestDto,
  //     req,
  //   );

  //   return res
  //     .status(HttpStatus.OK);
  //     // .json(new AuthSendVerificationResponseDto());
  // }

  @ApiOperation({
    summary: '重置Token時間',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @UseGuards(RefreshTokenGuard)
  // @ApiParam({type: String, name: 'refreshToken'})
  @Post('/refreshToken')
  //async authRefreshToken(@Body('refreshToken') rtoken:string, @Res() res:Response) {
  async authRefreshToken(@Body() body:RefreshTokenDto, @Req() req:Request, @Res() res:Response) {
    const alr = new AuthLoginResponseDto();
    const ans = this.authService.authRefreshToken(req);
    if (ans) {
      alr.data = {
        token: ans as string,
      }
    } else {
      alr.errorcode = ErrCode.TOKEN_ERROR;
      alr.error = {
        message: ErrMsg.TOKEN_ERROR,
      }
    }
    return res.status(HttpStatus.OK).json(alr);
  }
}
