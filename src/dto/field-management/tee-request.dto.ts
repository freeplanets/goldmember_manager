import { ApiProperty } from '@nestjs/swagger';
import { ITee } from '../interface/field-management.if';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TeeReqDto implements ITee {
    @ApiProperty({
        description: '發球局名稱',
        required: true,
        example: 'blueTee',
    })
    @IsString()
    tee: string;

    @ApiProperty({
        description: '球場係數',
        minimum: 60,
        maximum: 80,
        example: 73.5,
        //required: false,
    })
    //@IsOptional()
    @IsNumber()
    rating: number; //73.5,

    @ApiProperty({
        description: '斜度係數',
        minimum: 55,
        maximum: 155,
        example: 138,
        //required: false,
    })
    //@IsOptional()
    @IsNumber()
    slope: number;  //138        
}