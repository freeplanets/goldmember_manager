import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class authSendverificationBodyData {
  @ApiProperty({
    description: '',
    required: true,
  })
  @IsString()
  phone: string;  // memberId

  @ApiProperty({
    description: '',
    required: true,
  })
  @IsString()
  captcha: string;
}
