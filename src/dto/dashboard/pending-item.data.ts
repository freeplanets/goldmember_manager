import { PendingItemType } from '../../utils/enum';
import { IPendingITem } from '../interface/dashboard.if';
import { ApiProperty } from '@nestjs/swagger';

export class PendingItemData implements IPendingITem {
    @ApiProperty({
        description: '項目 ID',
    })
    id:	string; //項目 ID

    @ApiProperty({
        description: '項目類型',
        enum: PendingItemType,
        example: PendingItemType.RESERVATION,
    })
    type: PendingItemType;   //項目類型 Enum:[ reservation, announcement, coupon ]

    @ApiProperty({
        description: '標題',
    })
    title: string;  //標題

    @ApiProperty({
        description: '日期',
    })
    date: string;   //日期

    @ApiProperty({
        description: '狀態',
    })
    status:	string; //狀態

    @ApiProperty({
        description: '路由',
    })
    route: string;  //路由    
}