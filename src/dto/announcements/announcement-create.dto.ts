import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement } from '../interface/announcement.if';
import { IsOptional, IsString, Matches } from 'class-validator';
import { MEMBER_EXTEND_GROUP, MEMBER_GROUP } from '../../utils/enum';
import { FilesUploadDto } from '../common/files-upload.dto';
import { DateLocale } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export class AnnouncementCreateDto extends FilesUploadDto implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '標題',
        required: true,
        example: '一般公告'
    })
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
    @IsString()
    type?: string;

    @ApiProperty({
        description: '公告日期',
        required: true,
        example: myDate.toDateString(),
    })
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
    isPublished?: boolean;

    @ApiProperty({
        description: '是否置頂',
        required: false,
    })
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
        description: '發送對象',
        required: false,
        enum: MEMBER_GROUP,
        type: String || Object,
        isArray: true,
        //example: [ MEMBER_GROUP.GENERAL_MEMBER,{id: 'cba4f060-19d8-11f0-9afd-717ef138f560'}, MEMBER_GROUP.ALL]
    })
    targetGroups?: any[];
    //targetGroups: [MEMBER_GROUP];

    @ApiProperty({
        description: `進階選項,為當月份壽星`,
        required: false,
        enum: MEMBER_EXTEND_GROUP,
        isArray: true,
        example: [MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH],
    })
    extendFilter?: [MEMBER_EXTEND_GROUP];
}