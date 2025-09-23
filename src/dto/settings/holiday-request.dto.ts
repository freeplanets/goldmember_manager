import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HolidayReq {
    @ApiProperty({
        description: '年度',
        required: true,
    })
    @IsNumber()
    year:number;

    @ApiProperty({
        description: '月份',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    month:number;
}