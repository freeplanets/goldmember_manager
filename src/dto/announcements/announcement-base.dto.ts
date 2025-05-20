import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement } from "../interface/announcement.if";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { MEMBER_GROUP } from "../../utils/enum";
import { DateWithLeadingZeros } from "../../utils/common";

export class AnnouncementBaseDto implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '標題',
        required: false,
        example: '一般公告'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: '內容',
        required: false,
        example: '一般公告'
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        description: '類型',
        required: false,
    })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({
        description: '公告日期',
        required: false,
        example: DateWithLeadingZeros(),
    })
    @IsOptional()
    @IsString()
    publishDate?: string;

    @ApiProperty({
        description: '到期日',
        required: false,
    })
    @IsOptional()
    @IsString()
    expiryDate?: string;

    @ApiProperty({
        description: '是否發佈',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty({
        description: '是否置頂',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isTop?: boolean;

    @ApiProperty({
        description: '圖像',
        required: false,
    })
    @IsOptional()
    @IsString()
    iconType?: string;

    @ApiProperty({
        description: '',
        required: false,
        enum: MEMBER_GROUP,
        isArray: true,
        example: [ MEMBER_GROUP.GENERAL_MEMBER, MEMBER_GROUP.DIRECTOR_SUPERVISOR],
    })
    @IsOptional()
    @IsArray()
    targetGroups: MEMBER_GROUP[];
}