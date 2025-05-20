import { IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FaRequestDto {
  @ApiProperty({
    description: '雙因素驗證碼',
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsNumberString()
  totpCode?: string;
}
