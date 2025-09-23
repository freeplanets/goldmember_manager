import { IFairway } from '../interface/field-management.if';
import { ApiProperty } from '@nestjs/swagger';

export class FairwayDta implements Partial<IFairway> {
    @ApiProperty({
        description: '球道號碼',
    })
    fairway: number;    //1,

    @ApiProperty({
        description: '藍 Tee 距離（碼）',
    })
    blueTee: number;    //545,

    @ApiProperty({
        description: '白 Tee 距離（碼）',
    })
    whiteTee: number;   //526,

    @ApiProperty({
        description: '紅 Tee 距離（碼）',
    })
    redTee: number; //490,

    @ApiProperty({
        description: '標準桿數',
    })
    par: number;    //5,

    @ApiProperty({
        description: '難度指數 (HDR)'
    })
    hdp: number;    //8    
}