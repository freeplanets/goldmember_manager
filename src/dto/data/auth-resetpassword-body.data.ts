import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class authResetpasswordBodyData {
  @ApiProperty({
    description: '',
    required: true,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: '',
    required: true,
  })
  @IsString()
  verificationCode: string;

  @ApiProperty({
    description: '',
    required: true,
  })
  @IsString()
  newPassword: string;
}
