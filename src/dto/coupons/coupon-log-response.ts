import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { ICouponAutoIssuedLog } from "../interface/coupon.if";
import { CouponLogData } from "./coupon-log-data";

export class CouponLogRes extends CommonResponseDto implements ICommonResponse<ICouponAutoIssuedLog[]> {
    @ApiProperty({
        description: '自動發行記錄列表',
        type: CouponLogData,
        isArray: true,
    })
    data?: ICouponAutoIssuedLog[];
}