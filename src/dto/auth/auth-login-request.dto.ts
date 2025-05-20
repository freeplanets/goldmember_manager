import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginDevice } from '../devices/login-device';

export class AuthLoginRequestDto {
  @ApiProperty({
    description: '使用者名稱',
    required: false,
    example: 'user1234'
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: '密碼',
    required: false,
    example: 'abc1234'
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: '雙因素驗證碼',
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  totpCode?: string;

  @ApiProperty({
    description: '會員登入設備資訊(jwt token)',
    required: true,
    type: LoginDevice,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWl2Y2VCcmFuZCI6IkFwcGxlIiwiZGV2aWNlTW9kZWwiOiJpUGhvbmUiLCJkZXZpY2VOYW1lIjoiQXBwbGUgaVBob25lIFNhZmFyaSIsImRldmljZUlkIjoiMWRjYTMxNTktNDY1YS00OGRlLWIyNDgtOTcwNmUxNzY2MDAxIiwic3lzdGVtTmFtZSI6IlNhZmFyaSIsInN5c3RlbVZlcnNpb24iOiIxNi42IiwiaWF0IjoxNzQ1ODA1MDEwfQ.x2JGeaVAGmqsYIDiTQVRcnF_FFqYrafjIG_AM8kFngY',
  })
  @IsNotEmpty()
  @IsString()
  fingerprint:string;
}
