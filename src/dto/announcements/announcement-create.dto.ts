import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement, IAttachmemt } from "../interface/announcement.if";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { Attachment } from "./attachment";
import { ANNOUNCEMENT_GROUP, ANNOUNCEMENT_TYPE, SEARCH_GROUP_METHOD } from "../../utils/enum";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { FilesUploadDto } from "../common/files-upload.dto";

export class AnnouncementCreateDto extends FilesUploadDto implements Partial<IAnnouncement> {
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
        enum: ANNOUNCEMENT_TYPE,
        example: ANNOUNCEMENT_TYPE.ROUTINE,
    })
    @IsOptional()
    @IsString()
    type?: ANNOUNCEMENT_TYPE;

    @ApiProperty({
        description: '公告日期',
        required: false,
        example: new Date().toLocaleDateString(),
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
    iconType: string;

    // @ApiProperty({
    //     description: '附件',
    //     required: false,
    //     // example: [new Attachment()],
    // })
    // @IsOptional()
    // @IsArray()
    // attachments?: Attachment[] = [
    //     new Attachment(),
    // ];

    @ApiProperty({
        description: '',
        required: false,
        enum: ANNOUNCEMENT_GROUP,
        isArray: true,
        example: [ ANNOUNCEMENT_GROUP.GENERAL_MEMBER, ANNOUNCEMENT_GROUP.BIRTH_OF_MONTH]
    })
    @IsOptional()
    @IsArray()
    targetGroups: [ANNOUNCEMENT_GROUP];

    @ApiProperty({
        description: '聯集或交集',
        required: false,
        enum: SEARCH_GROUP_METHOD,
        example: SEARCH_GROUP_METHOD.INTERSECTION,
    })
    method?: SEARCH_GROUP_METHOD;
}