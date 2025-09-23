import { ApiProperty } from '@nestjs/swagger';
import { IFairway } from '../interface/field-management.if';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';


export class FairwayModifyDataDto implements Partial<IFairway> {
    @ApiProperty({
        description: '藍 Tee 距離（碼）',
        example: 545,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    blueTee: number;    //545,

    @ApiProperty({
        description: '白 Tee 距離（碼）',
        example: 526,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    whiteTee: number;   //526,

    @ApiProperty({
        description: '紅 Tee 距離（碼）',
        example: 490,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    redTee: number; //490,

    @ApiProperty({
        description: '標準桿數',
        example: 5,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    par: number;    //5,

    @ApiProperty({
        description: '難度指數 (HDR)',
        example: 8,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    hdp: number;    //8    
}