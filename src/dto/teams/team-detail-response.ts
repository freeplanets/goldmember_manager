import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ITeam } from '../interface/team-group.if';
import { ICommonResponse } from '../interface/common.if';
import { TeamData } from './team-data';

export class TeamDetailResponse extends CommonResponseDto implements ICommonResponse<ITeam> {
    @ApiProperty({
        description: '球隊資訊',
        type: TeamData,
    })
    data: ITeam;
}
        
    