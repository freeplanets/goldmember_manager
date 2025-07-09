import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement } from '../interface/announcement.if';
import { IModifiedBy } from '../interface/modifyed-by.if';

export class PartialAnnouncementsData implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '公告 ID',
    })
    id: string;    //公告 ID

    @ApiProperty({
        description: '標題',
    })
    title: string;  //標題

    @ApiProperty({
        description: '發布日期',
    })
    publishDate: string;    //發布日期

    @ApiProperty({
        description: '創建者',
    })
    creator?: IModifiedBy;
}