import { ApiProperty } from '@nestjs/swagger';
import { IReserveHistory } from '../interface/reservations.if';

export class ReserveHistory implements IReserveHistory {
    @ApiProperty({
        description: '日期',
    })
    date:string;    //($date)日期

    @ApiProperty({
        description: '時間',
    })
    time:string;    //時間

    @ApiProperty({
        description: '操作人員ID'
    })
    id:string;  //操作人員ID

    @ApiProperty({
        description: '操作人員',
    })
    name:string;    //操作人員

    @ApiProperty({
        description: '操作內容',
    })
    action:string;  //操作內容
}