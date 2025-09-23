import { ApiProperty } from '@nestjs/swagger';
import { IGreenSpeeds } from '../interface/field-management.if';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DateLocale } from '../../classes/common/date-locale';

export class GreenSpeedCreateReqDto implements Partial<IGreenSpeeds> {
    @ApiProperty({
        description: '記錄日期 (YYYY/MM/DD)',
        required: true,
        example: new DateLocale().toDateString(),
    })
    @IsString()
    date: string;

    @ApiProperty({
        description: '西區果嶺速度',
        required: true,
        minimum: 0,
        maximum: 20,
        example: 10.5,
    })
    @IsNumber()
    westSpeed?: number;
    
    @ApiProperty({
        description: '南區果嶺速度',
        required: true,
        minimum: 0,
        maximum: 20,
        example: 11.2,
    })
    @IsNumber()
    southSpeed?: number;

    @ApiProperty({
        description: '東區果嶺速度',
        required: true,
        minimum: 0,
        maximum: 20,
        example: 9.8
    })
    @IsNumber()
    eastSpeed?: number;

    @ApiProperty({
        description: '註記',
        required: false,
        maxLength: 500,
        example: '日天氣良好，果嶺狀況佳備註',
    })
    @IsOptional()
    @IsString()
    notes?: string; 
}