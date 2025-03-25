import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { CouponData } from './coupon.data';

export class CouponResponseDto extends CommonResponseDto implements ICommonResponse<CouponData> {
  @ApiProperty({
    description: '優惠券資料',
    type: CouponData,
  })
  data?: CouponData;
}
