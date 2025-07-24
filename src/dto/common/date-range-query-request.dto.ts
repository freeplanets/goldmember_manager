import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { DateWithLeadingZeros } from '../../utils/common';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class DateRangeQueryReqDto {
    @ApiProperty({
        description: '開始日期 (YYYY/MM/DD)',
        example: DateWithLeadingZeros(),
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    startDate:string

    @ApiProperty({
        description: '結束日期 (YYYY/MM/DD)',
        example: DateWithLeadingZeros(),
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    endDate:string;    
}