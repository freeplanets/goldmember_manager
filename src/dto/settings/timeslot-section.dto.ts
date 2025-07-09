import { ApiProperty } from '@nestjs/swagger';
import { ITimeslotSection } from '../../utils/settings/settings.if';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { TIME_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class TimeslotSectionDto implements ITimeslotSection {
    @ApiProperty({
        description: '開始時間',
        required: false,
        example: '05:00',
    })
    @IsOptional()
    @IsString()
    @Matches(TIME_STYLE, {message: DtoErrMsg.TIME_STYLE_ERROR})
    start_time: string; //'05:00', 開始時間

    @ApiProperty({
        description: '時段數量',
        required: false,
        example: 23,
    })
    @IsOptional()
    @IsNumber()
    number_of_slots: number; //23 時段數量
}