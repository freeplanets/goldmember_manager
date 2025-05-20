import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { ModifiedByData } from '../data/modified-by.data';
import { BIRTH_OF_MONTH, COUPON_BATCH_STATUS } from '../../utils/enum';
import { CouponBatchRequestDto } from './coupon-batch-request.dto';
import { IModifiedBy } from '../interface/modifyed-by.if';

export class CouponBatchData extends CouponBatchRequestDto implements Partial<ICouponBatch> {
  @ApiProperty({
    description: '編號',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
      description: `發行對象的生日月份`,
      required: false,
      enum: BIRTH_OF_MONTH,
      example: BIRTH_OF_MONTH.APRIL,
  })
  birthMonth?: BIRTH_OF_MONTH;

  @ApiProperty({
    description: '發行目標說明',
    required: false,
  })
  @IsOptional()
  @IsString()
  targetDescription?: string;  

  @ApiProperty({
    description: '核准人',
    type: ModifiedByData,
    required: false,
  })
  authorizer: IModifiedBy;

  @ApiProperty({
    description: '修改人',
  })
  updater: IModifiedBy;

  @ApiProperty({
    description: '取消者',
    required: false,
  })
  canceler: ModifiedByData;

  @ApiProperty({
    description: '狀態',
    enum: COUPON_BATCH_STATUS,
    default: COUPON_BATCH_STATUS.NOT_ISSUED,
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: COUPON_BATCH_STATUS;
}
