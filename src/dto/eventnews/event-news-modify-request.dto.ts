import { ApiProperty } from '@nestjs/swagger';
import { IEventNews } from '../interface/event-news';
import { IsNotEmpty, IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class EventNewsModifyReqDto implements Partial<IEventNews> {
    @ApiProperty({
        description: '賽事名稱',
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title: string;

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

    @ApiProperty({
        description: '地點',
        required: false,
    })
    @IsOptional()
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