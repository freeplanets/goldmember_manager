import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { ModifiedByData } from '../data/modified-by.data';
import { ANNOUNCEMENT_GROUP, COUPON_ISSUANCE_METHOD } from '../../utils/enum';
import { CouponBatchRequestDto } from './coupon-batch-request.dto';

export class CouponBatchData extends CouponBatchRequestDto implements ICouponBatch {
  @ApiProperty({
    description: '編號',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;



  @ApiProperty({
    description: '核准人',
    required: false,
  })
  authorizer: ModifiedByData;

  @ApiProperty({
    description: '取消者',
    required: false,
  })
  canceler: ModifiedByData;
}
