import { ApiProperty } from '@nestjs/swagger';
import { IEventNews } from '../interface/event-news';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class EventNewsCreateReqDto implements Partial<IEventNews> {
    @ApiProperty({
        description: '賽事名稱',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: '開始日期',
        required: true,
    })
    @Matches(DATE_STYLE, { message: DtoErrMsg.DATE_STYLE_ERROR})
    dateStart: string;

    @ApiProperty({
        description: '結束日期',
        required: true,
    })
    @Matches(DATE_STYLE, { message: DtoErrMsg.DATE_STYLE_ERROR})
    dateEnd: string;

    @ApiProperty({
        description: '地點',
        required: true,
    })
    @IsString()
    location: string;

    @ApiProperty({
        description: '說明',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}