import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResetPasswordRequestDto {
  @ApiProperty({
    description: '手機號碼',
    required: true,
    example: '0922123456'
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: '認證碼',
    required: true,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  verificationCode: string;

  @ApiProperty({
    description: '新密碼',
    required: true,
    example: 'Abc12345',
  })
  @IsOptional()
  @IsString()
  newPassword: string;
}
