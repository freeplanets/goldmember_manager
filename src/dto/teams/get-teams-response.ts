import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { ITeam } from '../interface/team-group.if';
import { TeamData } from './team-data';

export class GetTeamsResponse extends CommonResponseDto implements ICommonResponse<ITeam[]> {
    @ApiProperty({
        description: '球隊列表',
        type: TeamData,
        isArray: true,
    })
    data: ITeam[];
}
    