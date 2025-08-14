import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement, IAttachmemt } from '../interface/announcement.if';
import { AnnouncementCreateDto } from './announcement-create.dto';
import { Attachment } from './attachment';
import { IsOptional, IsPassportNumber, IsString } from 'class-validator';
import { DateLocale } from '../../classes/common/date-locale';

export class AnnouncementModifyDto extends AnnouncementCreateDto implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '標題',
        required: false,
        example: '一般公告'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: '公告日期',
        required: false,
        example: new DateLocale().toDateString(),
    })
    @IsOptional()
    @IsString()
    publishDate?: string;

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

    @ApiProperty({
        description: '類型',
        required: false,
    })
    @IsOptional()
    @IsString()
    type?: string;
}