import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ILogin } from '../interface/auth.if';

export class LoginRequestData implements ILogin {
  @ApiProperty({
    description: '使用者名稱',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '密碼',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '雙因素驗證碼(限時一次性驗證嗎)',
    required: true,
  })
  @IsString()
  totpCode: string;
}
