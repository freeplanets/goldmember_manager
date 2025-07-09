import { ApiProperty } from '@nestjs/swagger';
import { ITimeslots, ITimeslotSection } from '../../utils/settings/settings.if';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { TimeslotSectionDto } from './timeslot-section.dto';

export class TimeslotsDto implements ITimeslots {
    @ApiProperty({
        description: '開始月份',
        required: false,
        example: 6
    })
    @IsOptional()
    @IsNumber()
    start_month: number;    // 6,   // 開始月份

    @ApiProperty({
        description: '開始日期',
        required: false,
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    start_day: number;  // 1,   // 開始日期

    @ApiProperty({
        description: 'slot 間隔時間(分鐘）',
        required: false,
        example: 7,
    })
    @IsOptional()
    @IsNumber()
    gap: number;    // 7,   // slot 間隔時間(分鐘）

    @ApiProperty({
        description: '每日時段列表',
        required: false,
        type: TimeslotSectionDto,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    sections: ITimeslotSection[]; // 每日時段列表
}