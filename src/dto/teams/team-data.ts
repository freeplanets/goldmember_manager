import { ApiProperty } from '@nestjs/swagger';
import { ICreditRecord, ITeam, ITeamActivity, ITeamAnnouncement, ITeamMember, ITeamPositionInfo } from '../interface/team-group.if';
import { TeamStatus } from '../../utils/enum';
import TeamPositonInfo from './team-position-info';
import { TeamMemberData } from './team-member-data';

export class TeamData implements ITeam {
    @ApiProperty({
        description: '球隊 ID',
    })
    id: string; //球隊 ID

    @ApiProperty({
        description: '球隊名稱',
    })
    name: string;   //球隊名稱

    @ApiProperty({
        description: '球隊狀態',
        enum: TeamStatus,
        example: TeamStatus.ACTIVE,
    })
    status:	TeamStatus; //球隊狀態

    @ApiProperty({
        description: '信用評分',
        example: 100,
    })
    creditScore: number;    //信用評分

    @ApiProperty({
        description: '球隊 Logo URL',
        example: 'https://example.com/logo.png',
    })
    logoUrl: string;    //球隊 Logo URL

    @ApiProperty({
        description: '球隊描述',
        example: '這是一支優秀的球隊。',
    })
    description: string;    //球隊描述

    @ApiProperty({
        description: '隊長資訊',
        type: TeamPositonInfo,
    })
    leader:	ITeamPositionInfo;  // 隊長

    @ApiProperty({
        description: '教練資訊',
        type: TeamPositonInfo,
    })
    manager: ITeamPositionInfo; // 經理

    @ApiProperty({
        description: '最近活動日期',
        example: '2023/10/01',
    })
    lastActivity: string; //最近活動日期

    @ApiProperty({
        description: '隊員清單',
        type: TeamMemberData,
        isArray: true,
    })
    members?: ITeamMember[]; // 隊員清單

    @ApiProperty({
        description: '評分記錄',
    })
    creditHistory?: ICreditRecord[]; //評分記錄

    @ApiProperty({
        description: '公告',
    })
    announcements?: ITeamAnnouncement[]; // 公告

    @ApiProperty({
        description: '活動',
    })
    activities?: ITeamActivity[];    // 活動
}