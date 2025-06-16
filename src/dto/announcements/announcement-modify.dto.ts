import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement, IAttachmemt } from "../interface/announcement.if";
import { AnnouncementCreateDto } from "./announcement-create.dto";
import { Attachment } from "./attachment";
import { DateWithLeadingZeros } from "../../utils/common";
import { IsOptional, IsString } from "class-validator";

export class AnnouncementModifyDto extends AnnouncementCreateDto implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '公告日期',
        required: false,
        example: DateWithLeadingZeros(),
    })
    @IsOptional()
    @IsString()
    publishDate?: string;

    @ApiProperty({
        description: '標題',
        required: false,
        example: '一般公告'
    })
    title?: string;

    @ApiProperty({
        description: '內容',
        required: false,
        example: '一般公告'
    })
    content?: string;
    
    @ApiProperty({
        description: '附件',
        required: false,
        type: Attachment,
        isArray: true,
        // example: [new Attachment()],
    })
    attachments?: IAttachmemt[];

}