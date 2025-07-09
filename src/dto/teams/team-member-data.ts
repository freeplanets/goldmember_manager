import { ApiProperty } from '@nestjs/swagger';
import { ITeamMember } from '../interface/team-group.if';
import { MEMBER_LEVEL, TeamMemberPosition } from '../../utils/enum';

export class TeamMemberData implements ITeamMember {
    @ApiProperty({
        description: '球隊 ID',
    })
    teamId?: string;    //球隊ID

    @ApiProperty({
        description: '會員 ID',
    })
    memberId: string; // 會員 ID

    @ApiProperty({
        description: '會員姓名',
    })
    name: string; // 會員姓名

    @ApiProperty({
        description: '角色',
        enum: TeamMemberPosition,
        example: TeamMemberPosition.MEMBER,
    })
    role: TeamMemberPosition; // 角色

    @ApiProperty({
        description: '加入日期',
        example: '2023/10/01',
    })
    joinDate: string; //加入日期

    @ApiProperty({
        description: '是否活躍',
        example: true,
    })
    isActive: boolean; //是否活躍

    @ApiProperty({
        description: '電話',
        example: '0912345678',
        required: false,
    })
    phone?: string; // 電話

    @ApiProperty({
        description: '會員類型',
        enum: MEMBER_LEVEL,
        required: false,
        example: MEMBER_LEVEL.GENERAL_MEMBER,
    })
    membershipType?: MEMBER_LEVEL; //會員類型

    @ApiProperty({
        description: '股東代號',
        required: false,
    })  
    systemId?: string;   // 國興ID
}