import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../../dto/interface/common.if';
import { UserDetailDataDto } from './user-detail-data.dto';

export class UsersIdResponseDto extends CommonResponseDto implements ICommonResponse<UserDetailDataDto> {
  @ApiProperty({
    description: "使用者資料",
    type: UserDetailDataDto,
  })
  data?: UserDetailDataDto;
}
