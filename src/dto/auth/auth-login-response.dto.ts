import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginResponseData } from '../data/login-response.data';
import { ICommonResponse } from '../interface/common.if';
import { CommonResponseDto } from '../common-response.dto';

export class AuthLoginResponseDto extends CommonResponseDto implements ICommonResponse<LoginResponseData> {
  @ApiProperty({
    description: 'token',
    required: true,
  })
  @IsObject()
  data: LoginResponseData;
}
