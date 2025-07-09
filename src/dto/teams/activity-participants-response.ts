import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IActMemberInfo, ITeamMember } from '../interface/team-group.if';
import { ActivityMemberInfo } from './activity-member-info';

export class ActivityParticipantsResponse extends CommonResponseDto implements ICommonResponse<Partial<IActMemberInfo>[]> {
    @ApiProperty({
        description: '活動成員列表',
        type: ActivityMemberInfo,
        isArray: true,
    })
    data?: Partial<IActMemberInfo>[];
}