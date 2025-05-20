import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { CouponBatchData } from './coupon-batch.data';
import { ICouponBatch } from '../interface/coupon.if';

export class CouponBatchesIdResponseDto extends CommonResponseDto implements ICommonResponse<Partial<ICouponBatch>> {
  @ApiProperty({
    description: '優惠券批次資料',
    type: CouponBatchData,
  })
  data?: Partial<ICouponBatch>;
}
