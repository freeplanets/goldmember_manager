import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { CouponTransferLogData } from "./coupon-transfer-log";
import { ICouponTransferLog } from "../interface/coupon.if";

export class CouponTransferLogRes extends CommonResponseDto implements ICommonResponse<Partial<ICouponTransferLog>[]> {
    @ApiProperty({
        description: '優惠券轉移紀錄',
        type: CouponTransferLogData,
        isArray: true,
    })
    data?: Partial<ICouponTransferLog>[];
}
    
    
