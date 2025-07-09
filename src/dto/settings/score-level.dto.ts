import { ApiProperty } from '@nestjs/swagger';
import { IScoreLevel } from '../../utils/settings/settings.if';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ScoreLevelDto implements IScoreLevel {
    @ApiProperty({
        description: '最低分數要求',
        required: false,
        example: '0',
    })
    @IsOptional()
    @IsNumberString()
    min_score: string;  // '0', 最低分數要求

    @ApiProperty({
        description: '預約開放月份數',
        required: false,
        example: '3',
    })
    @IsOptional()
    @IsNumberString()
    open_months: string;    //'3', 預約開放月份數

    @ApiProperty({
        description: '每日最大預約時段數',
        required: false,
        example: '2',
    })
    @IsOptional()
    @IsNumberString()
    daily_max_slots: string;    //'2',  每日最大預約時段數

    @ApiProperty({
        description: '每月總預約時段數',
        required: false,
        example: '20',

    })
    total_max_slots: string;    // '20', 每月總預約時段數  
}