import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class idStatusBodyData {
  @ApiProperty({
    description: '',
    required: true,
  })
  @IsBoolean()
  isActive: boolean;
}
