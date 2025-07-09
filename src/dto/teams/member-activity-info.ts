import { ApiProperty } from '@nestjs/swagger';
import { TeamActivityRegistrationStatus } from '../../utils/enum';
import { IMemberActivityInfo } from '../interface/team-group.if';

export class MemberActivityInfo implements IMemberActivityInfo {
    @ApiProperty({
        description: '活動ID',
    })
    activityId: string;

    @ApiProperty({
        description: '登記日期',
    })
    registrationDate: string;

    @ApiProperty({
        description: '狀態',
    })
    status: TeamActivityRegistrationStatus;    
}