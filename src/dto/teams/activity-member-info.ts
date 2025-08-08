import { MEMBER_LEVEL, TeamActivityRegistrationStatus } from '../../utils/enum';
import { IActMemberInfo } from '../interface/team-group.if';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityMemberInfo implements Partial<IActMemberInfo> {
    @ApiProperty({
        description: '會員代號',
    })
    id: string;

    @ApiProperty({
        description: '會員名稱',
    })
    name: string;

    @ApiProperty({
        description: '電話',
    })
    phone: string;

    @ApiProperty({
        description: '會員型態',
        enum: MEMBER_LEVEL,
        example: MEMBER_LEVEL.GENERAL_MEMBER,
    })
    membershipType?: MEMBER_LEVEL;

    @ApiProperty({
        description: '登記日期',
    })
    registrationDate?: string;

    @ApiProperty({
        description: '登記狀態',
        enum: TeamActivityRegistrationStatus,
        example: TeamActivityRegistrationStatus.CONFIRMED,
    })
    status?: TeamActivityRegistrationStatus;
}