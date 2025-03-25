import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { CouponBatchData } from './coupon-batch.data';

export class CouponBatchesIdResponseDto extends CommonResponseDto implements ICommonResponse<CouponBatchData> {
  @ApiProperty({
    description: '優惠券批次資料',
    type: CouponBatchData,
  })
  data?: CouponBatchData;
}
