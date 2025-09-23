import { ApiProperty } from '@nestjs/swagger';
import { IHoliday } from '../interface/common.if';

export class HolidayDta implements Partial<IHoliday> {
    @ApiProperty({
        description: '日期',
    })
    date: string;

    @ApiProperty({
        description: '名稱',
    })
    name: string;

    @ApiProperty({
        description: '假日類型',
    })
    holidayCategory: string;

    @ApiProperty({
        description: '描述',
    })
    description: string;
}