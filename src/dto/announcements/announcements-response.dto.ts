import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { AnnouncementData } from './announcement.data';

export class AnnouncementsResponseDto extends CommonResponseDto implements ICommonResponse<AnnouncementData[]> {
    @ApiProperty({
        description: '公告列表',
        type: AnnouncementData,
        isArray: true,
    })
    data?: AnnouncementData[];
}
