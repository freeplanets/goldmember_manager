import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MembersDirectorStatusRequestDto {
  @ApiProperty({
    description: '是否為董監',
    required: false,
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isDirector?: boolean;
}
