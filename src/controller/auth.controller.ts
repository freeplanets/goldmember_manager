import { Controller, Req, Res, HttpStatus, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthLoginRequestDto } from '../dto/auth/auth-login-request.dto';
import { AuthLoginResponseDto } from '../dto/auth/auth-login-response.dto';
import { AuthResetPasswordRequestDto } from '../dto/auth/auth-reset-password-request.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { RefreshTokenGuard } from '../utils/tokens/refresh-token-guard';
import { RefreshTokenDto } from '../dto/auth/auth-refresh-token-request.dto';
import { AuthSMSRequestDto } from '../dto/auth/auth-sms-request.dto';
import { AuthSendVerificationResponseDto } from '../dto/auth/auth-send-verification-response.dto';
import { Verify2FaRequestDto } from '../dto/auth/verify-2fa-request.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { DeviceTokenGuard } from '../utils/tokens/device-token-guard';
import { DeviceRefreshTokenDto } from '../dto/auth/auth-device-refresh-token-request.dto';
import { AuthRefreshTokenResponse } from '../dto/auth/auth-refresh-token-response';
import { AddTraceIdToResponse } from '../utils/constant';

@Controller('auth')
@ApiTags('auth')
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log("ip:", ip);
    // console.log('forwarded:', forwarded, req.ips, req.ip);
    // const ip = typeof forwarded === 'string' ? forwarded : (forwarded as string[])?.length > 0 ? forwarded[0] : null;
    const rlt = await this.authService.authLogin(authLoginRequestDto, ip);
    AddTraceIdToResponse(rlt, req);
    return res.status(HttpStatus.OK).json(rlt);
  }

  @ApiOperation({
    description: '2Fa token verify',
  })
  @ApiResponse({
    description: '成功或失敗',
    //type: AuthResetPasswordResponseDto,
    type: CommonResponseDto,
  })
  @UseGuards(TokenGuard)
  @Post('verify2fa')
  @ApiBearerAuth()
  async token2FaVerify(
    @Body() {totpCode}: Verify2FaRequestDto,
    @Req() req: any,
    @Res() res:Response,
  ) {
    const ans = await this.authService.verify2Fa(req.user, totpCode);
    AddTraceIdToResponse(ans, req);
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
  // @UseGuards(TokenGuard)
  @Post('/resetpassword')
  async authResetPassword(
    @Body() authResetPasswordRequestDto: AuthResetPasswordRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ans = await this.authService.authResetPassword(authResetPasswordRequestDto);
    AddTraceIdToResponse(ans, req);
    return res.status(HttpStatus.OK).json(ans);
  }

  @ApiOperation({
    summary: '重置Token時間',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AuthRefreshTokenResponse,
  })
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('/refreshToken')
  //async authRefreshToken(@Body('refreshToken') rtoken:string, @Res() res:Response) {
  async authRefreshToken(@Body() body:RefreshTokenDto, @Req() req:Request, @Res() res:Response) {
    const ans = await this.authService.authRefreshToken(req);
    AddTraceIdToResponse(ans, req);
    return res.status(HttpStatus.OK).json(ans);
  }

  @ApiOperation({
    summary: '重置Token時間',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AuthLoginResponseDto,
  })
  @UseGuards(DeviceTokenGuard)
  // @ApiParam({type: String, name: 'refreshToken'})
  @ApiBearerAuth()
  @Post('/deviceRefreshToken')
  //async authRefreshToken(@Body('refreshToken') rtoken:string, @Res() res:Response) {
  async authDeviceRefreshToken(@Body() body:DeviceRefreshTokenDto, @Req() req:Request, @Res() res:Response) {
    const alr = await this.authService.authDeviceRefreshToken(req);
    AddTraceIdToResponse(alr, req);
    return res.status(HttpStatus.OK).json(alr);
  }

  @ApiOperation({
    summary: '產生驗證碼圖片',
    description: '',
  })
  @ApiResponse({
    description: '驗證碼(svg)',
    type: AuthSendVerificationResponseDto,
  })
  @Get('captcha')
  async getCaptcha(
    @Req() req:Request,
    @Res() res:Response
  ) {
    const verifyRes = await this.authService.getCaptcha();
    //return res.type('svg').status(HttpStatus.OK).send(verifyRes);
    AddTraceIdToResponse(verifyRes, req);
    return res.status(HttpStatus.OK).json(verifyRes);
  }

  @ApiOperation({
    summary: '取得簡訊認證碼',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('sendsmscode')
  async getVerifiedCode(
    @Body() smsReq:AuthSMSRequestDto,
    @Req() req:Request,
    @Res() res:Response,
  ){
    const ans  = await this.authService.sendSmsCode(smsReq);
    AddTraceIdToResponse(ans, req);
    return res.status(HttpStatus.OK).send(ans);
  }

  @ApiOperation({
    description: '登出'
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,    
  })
  @UseGuards(TokenGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Req() req:any,@Res() res:Response) {
    const comRes = await this.authService.logout(req.user);
    AddTraceIdToResponse(comRes, req);
    return res.status(HttpStatus.OK).json(comRes);
  }
}
