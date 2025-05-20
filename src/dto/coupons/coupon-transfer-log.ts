import { ApiProperty } from "@nestjs/swagger";
import { ICouponTransferLog } from "../interface/coupon.if";

export class CouponTransferLogData implements Partial<ICouponTransferLog> {
    @ApiProperty({
        description: '優惠券轉移紀錄ID',
    })
    id: string;

    @ApiProperty({
        description: '優惠券ID',
    })
    couponId: string;

    @ApiProperty({
        description: '新擁有者名稱',
    })
    newOwner: string;

    @ApiProperty({
        description: '新擁有者ID',
    })
    newOwnerId: string;
    @ApiProperty({
        description: '原擁有者名稱',
    })
    originalOwner: string;
    @ApiProperty({
        description: '原擁有者ID',
    })
    originalOwnerId: string;

    @ApiProperty({
        description: '轉移日期',
    })
    transferDate: string;
    
    @ApiProperty({
        description: '轉移日期時間戳記',
    })
    transferDateTS: number;
}
    
