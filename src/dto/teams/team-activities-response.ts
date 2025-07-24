import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { ITeamActivity } from "../interface/team-group.if";
import { TeamActivitiesCreateRequestDto } from "./team-activities-create-request.dto";

export class TeamActivitiesRes extends CommonResponseDto implements ICommonResponse<Partial<ITeamActivity>[]> {
    @ApiProperty({
        description: '活動列表',
        type: TeamActivitiesCreateRequestDto,
        isArray: true,
    })
    data?: Partial<ITeamActivity>[];
}