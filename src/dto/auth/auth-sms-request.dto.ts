import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SmsCodeUsage } from '../../utils/enum';

export class AuthSMSRequestDto {
  @ApiProperty({
    description: '手機號碼',
    required: true,
    example: '0922123456'
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: '圖形驗證碼ID',
    required: true,
    example: '1234567890',
  })
  @IsString()
  captchaId: string;

  @ApiProperty({
    description: '圖形認證碼',
    required: true,
    example: '1A34',
  })
  @IsString()
  captchaCode: string;
  @ApiProperty({
    description: '認證碼用途',
    enum: SmsCodeUsage,
    example: SmsCodeUsage.REGISTER,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  codeUsage:SmsCodeUsage;

}
