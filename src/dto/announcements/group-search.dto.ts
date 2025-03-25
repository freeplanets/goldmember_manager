import { ANNOUNCEMENT_GROUP, SEARCH_GROUP_METHOD } from "../../utils/enum";
import { IGroupsSearch } from "../interface/announcement.if";
import { ApiProperty } from "@nestjs/swagger";

export class GroupSearch implements IGroupsSearch {
    @ApiProperty({
        description: '群組集合',
        enum: ANNOUNCEMENT_GROUP,
        isArray: true,
        example: [ANNOUNCEMENT_GROUP.BIRTH_OF_MONTH, ANNOUNCEMENT_GROUP.SHARE_HOLDER],
    })
    group: ANNOUNCEMENT_GROUP[];

    @ApiProperty({
        description: '交集或聯集',
        enum: SEARCH_GROUP_METHOD,
        example: SEARCH_GROUP_METHOD.INTERSECTION,
    })
    method: SEARCH_GROUP_METHOD;
}