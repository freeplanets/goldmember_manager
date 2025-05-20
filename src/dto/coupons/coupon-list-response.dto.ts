import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { CouponData } from './coupon.data';

export class CouponListResponseDto extends CommonResponseDto implements ICommonResponse<CouponData[]> {
  @ApiProperty({
    description: '優惠券資料列表',
    type: CouponData,
    isArray: true
  })
  data?: CouponData[];
}
