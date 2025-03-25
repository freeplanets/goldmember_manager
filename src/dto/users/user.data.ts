import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDetailDataDto } from './user-detail-data.dto';

export class UserData extends UserDetailDataDto {
  @ApiProperty({
    description: '啟用二階段認證',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  has2Fa?: boolean;

  @ApiProperty({
    description: '二階段認證碼',
    required: false
  })
  SecretCode?: string;
}
