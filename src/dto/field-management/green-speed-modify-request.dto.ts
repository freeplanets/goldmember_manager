import { ApiProperty } from '@nestjs/swagger';
import { IGreenSpeeds } from '../interface/field-management.if';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DateLocale } from '../../classes/common/date-locale';

export class GreenSpeedModifyReqDto implements Partial<IGreenSpeeds> {
    @ApiProperty({
        description: '記錄日期 (YYYY/MM/DD)',
        required: false,
        example: new DateLocale().toDateString(),
    })
    @IsOptional()
    @IsString()
    date: string;

    @ApiProperty({
        description: '西區果嶺速度',
        required: false,
        minimum: 0,
        maximum: 20,
        example: 10.5,
    })
    @IsOptional()
    @IsNumber()
    westSpeed?: number;
    
    @ApiProperty({
        description: '南區果嶺速度',
        required: false,
        minimum: 0,
        maximum: 20,
        example: 11.2,
    })
    @IsOptional()
    @IsNumber()
    southSpeed?: number;

    @ApiProperty({
        description: '東區果嶺速度',
        required: false,
        minimum: 0,
        maximum: 20,
        example: 9.8
    })
    @IsOptional()
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