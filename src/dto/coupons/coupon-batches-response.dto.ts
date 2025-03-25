import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponBatchData } from './coupon-batch.data';
import { CommonResponseDto } from '../common-response.dto';
import { ICommonResponse } from '../interface/common.if';

export class CouponBatchesResponseDto extends CommonResponseDto implements ICommonResponse<CouponBatchData[]> {
    @ApiProperty({
        description: '優惠券批次列表',
        type: CouponBatchData,
        isArray: true,
    })
    data?: CouponBatchData[];
}
