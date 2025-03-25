import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSendVerificationRequestDto {
  @ApiProperty({
    description: '手機號碼',
    required: false,
    example: '0922123456',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '驗證碼',
    required: false,
    example: 'finding'
  })
  @IsOptional()
  @IsString()
  captcha?: string;
}
