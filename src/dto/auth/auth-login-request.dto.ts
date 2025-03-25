import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
