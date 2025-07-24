import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IEventNews } from '../interface/event-news';
import { EventNewsData } from './event-news-data';

export class EventNewsListRes extends CommonResponseDto implements ICommonResponse<Partial<IEventNews>[]> {
    @ApiProperty({
        description: '賽事訊息列表',
        type: EventNewsData,
        isArray: true,
    })
    data?: Partial<IEventNews>[];
}