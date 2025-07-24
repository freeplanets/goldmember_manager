import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IEventNews } from '../interface/event-news';
import { EventNewsData } from './event-news-data';

export class EventNewsRes extends CommonResponseDto implements ICommonResponse<Partial<IEventNews>> {
    @ApiProperty({
        description: '賽事訊息',
        type: EventNewsData,
    })
    data?: Partial<IEventNews>;
}