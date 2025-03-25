import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class idDirectorstatusBodyData {
  @ApiProperty({
    description: '',
    required: true,
  })
  @IsBoolean()
  isDirector: boolean;
}
