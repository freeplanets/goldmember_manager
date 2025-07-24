import { ApiProperty } from '@nestjs/swagger';
import { IEventNews } from '../interface/event-news';
import { IsOptional, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class EventNewsQueryRequest implements Partial<IEventNews> {
    @ApiProperty({
        description: '開始日期',
        required: false,
    })
    @IsOptional()
    @Matches(DATE_STYLE, { message: DtoErrMsg.DATE_STYLE_ERROR})
    dateStart: string;

    @ApiProperty({
        description: '結束日期',
        required: false,
    })
    @IsOptional()
    @Matches(DATE_STYLE, { message: DtoErrMsg.DATE_STYLE_ERROR})
    dateEnd: string;
}