import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement, IAttachmemt } from '../interface/announcement.if';
import { Attachment } from './attachment';
import { MEMBER_EXTEND_GROUP, MEMBER_GROUP } from '../../utils/enum';
import { DateLocale } from '../../classes/common/date-locale';

export class AnnouncementUpdateDto  implements Partial<IAnnouncement> {
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
        description: '類型',
        required: false,
    })
    type?: string;

    @ApiProperty({
        description: '公告日期',
        required: false,
        example: new DateLocale().toDateString(),
    })
    publishDate?: string;

    @ApiProperty({
        description: '到期日',
        required: false,
    })
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
    iconType: string;

    @ApiProperty({
        description: '附件',
        required: false,
        type: Array<Attachment>,
        isArray: true,
        // example: [new Attachment()],
    })
    attachments?: IAttachmemt[];

    @ApiProperty({
        description: '發送對象',
        required: false,
        enum: MEMBER_GROUP,
        isArray: true,
        example: [ MEMBER_GROUP.GENERAL_MEMBER, MEMBER_GROUP.ALL]
    })
    targetGroups: [MEMBER_GROUP];

    @ApiProperty({
        description: `進階選項,為當月份壽星`,
        required: false,
        enum: MEMBER_EXTEND_GROUP,
        isArray: true,
        example: [MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH],
    })
    extendFilter?: [MEMBER_EXTEND_GROUP];
}