import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement } from "../interface/announcement.if";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { MEMBER_EXTEND_GROUP, MEMBER_GROUP } from "../../utils/enum";

export class AnnouncementSearch implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '公告類型',
        required: false,
    })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({
        description: '群組查詢組合',
        required: false,
        enum: MEMBER_GROUP,
        isArray: true,
        examples: [MEMBER_GROUP.DIRECTOR_SUPERVISOR, MEMBER_GROUP.SHARE_HOLDER],
    })
    @IsOptional()
    @IsArray()
    targetGroups?: [MEMBER_GROUP];

    @ApiProperty({
        description: `進階選項,為當月份壽星`,
        required: false,
        enum: MEMBER_EXTEND_GROUP,
        isArray: true,
        example: [MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH],
    })
    @IsOptional()
    @IsArray()
    extendFilter?: [MEMBER_EXTEND_GROUP];
    // @ApiProperty({
    //     description: '聯集或交集',
    //     required: false,
    //     enum: SEARCH_GROUP_METHOD,
    //     example: SEARCH_GROUP_METHOD.INTERSECTION,
    // })
    // method?: SEARCH_GROUP_METHOD;
}