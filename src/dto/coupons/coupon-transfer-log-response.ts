import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { CouponTransferLogData } from "./coupon-transfer-log";

export class CouponTransferLogRes extends CommonResponseDto implements ICommonResponse<CouponTransferLogData[]> {
    @ApiProperty({
        description: '優惠券轉移紀錄',
        type: CouponTransferLogData,
        isArray: true,
    })
    data?: CouponTransferLogData[];
}
    
    
