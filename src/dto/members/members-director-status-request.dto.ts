import { IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MembersDirectorStatusRequestDto {
  @ApiProperty({
    description: '是否為董監',
    required: true,
    example: false
  })
  @IsNotEmpty()
  @IsBoolean()
  isDirector?: boolean;
}
