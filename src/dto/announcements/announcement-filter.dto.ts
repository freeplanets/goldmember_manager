import { MEMBER_EXTEND_GROUP, MEMBER_GROUP, BIRTH_OF_MONTH } from "../../utils/enum";
import { IAnnouncement } from "../interface/announcement.if";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class AnnouncementFilterDto implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '發送對象',
        required: false,
        enum: MEMBER_GROUP,
        isArray: true,
        example: [ MEMBER_GROUP.GENERAL_MEMBER, MEMBER_GROUP.DIRECTOR_SUPERVISOR],
    })
    @IsOptional()
    @IsArray()
    targetGroups: MEMBER_GROUP[];

    @ApiProperty({
        description: `進階選項,預設為當月份壽星`,
        required: false,
        enum: MEMBER_EXTEND_GROUP,
        isArray: true,
        example: [MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH],
    })
    @IsOptional()
    @IsArray()
    extendFilter?: [MEMBER_EXTEND_GROUP];
}