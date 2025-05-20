import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICommonResponse } from '../interface/common.if';
import { CommonResponseDto } from '../common/common-response.dto';
import { MemberListDataDto } from './member-list-data.dto';

export class MembersResponseDto extends CommonResponseDto implements ICommonResponse<MemberListDataDto[]> {
    @ApiProperty({
        description: '會員列表',
        type: MemberListDataDto,
        isArray: true,
    })
    data?: MemberListDataDto[];
}
