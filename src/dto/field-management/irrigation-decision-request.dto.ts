import { ApiProperty } from '@nestjs/swagger';
import { IIrrigationDecisions } from '../interface/field-management.if';
import { DateLocale } from '../../classes/common/date-locale';
import { IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class IrrigationDecisionReqDto implements Partial<IIrrigationDecisions> {
    @ApiProperty({
        description: '日期',
        example: new DateLocale().toDateString(),
        required: true,
    })
    @IsString()
    @Matches(DATE_STYLE, { message: DtoErrMsg.DATE_STYLE_ERROR })  
    date: string;   //2025/01/15,

    @ApiProperty({
        description: '果嶺代號',
        example: 'W01A',
        required: true,
    })
    @IsString()
    greenId: string;    //W01A,

    @ApiProperty({
        description: '過去24小時降雨量 (毫米)',
        example: 5.2,
        required: true,
    })
    @IsNumber()
    rain24h: number;    //5.2,

    @ApiProperty({
        description: '當日最高氣溫 (攝氏度)',
        example: 28.5,
    })
    @IsNumber()
    tmax: number;   //28.5,

    @ApiProperty({
        description: '風速 (公尺/秒)',
        example: 3.2,
        minimum: 0, 
    })
    @IsNumber()
    @Min(0)
    windSpeed: number;  //3.2,

    @ApiProperty({
        description: '參考蒸散量 (毫米)',
        example: 4.2,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    et0: number;    //4.2,

    @ApiProperty({
        description: '5公分土壤含水量 (%)',
        required: true,
        minimum: 0,
        maximum: 100,
        example: 22.5,
    })
    @IsNumber()
    @Min(0)    
    @Max(100)
    sm5cm: number;  //22.5,

    @ApiProperty({
        description: '12公分土壤含水量 (%)',
        minimum: 0,
        maximum: 100,
        example: 35.8,
        required: true,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    sm12cm: number; //35.8,

    @ApiProperty({
        description: '20公分土壤含水量 (%)',
        required: true,
        minimum: 0,
        maximum: 100,
        example: 42.1,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    sm20cm: number; //42.1,

    @ApiProperty({
        description: 'decisionAM',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    decisionAM?: number;

    @ApiProperty({
        description: 'decisionPM',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    decisionPM?: number;

    @ApiProperty({
        description: 'mode',
        required: false,
    })
    @IsOptional()
    @IsString()
    mode?: string;

    @ApiProperty({
        description: '備註',
        required: false,
        maxLength: 500,
        example: '根層偏乾，建議中度灌溉',
    })
    @IsOptional()
    @IsString()
    comments: string;   // 根層偏乾，建議中度灌溉
}