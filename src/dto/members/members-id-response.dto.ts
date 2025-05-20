import { IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberData } from './member.data';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';

export class MembersIdResponseDto extends CommonResponseDto implements ICommonResponse<MemberData> {
  @ApiProperty({
    description: '會員資料',
    type: MemberData,
  })
  data?: MemberData;
}
