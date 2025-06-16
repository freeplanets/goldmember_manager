import { ApiProperty } from '@nestjs/swagger';
import { ITeamPositionInfo } from '../interface/team-group.if';

export class TeamPositonInfo implements ITeamPositionInfo {
    @ApiProperty({
        description: 'ID',
    })
    id: string;

    @ApiProperty({
        description: '姓名',
    })
    name: string;

    @ApiProperty({
        description: '電話',
    })
    phone: string;
}