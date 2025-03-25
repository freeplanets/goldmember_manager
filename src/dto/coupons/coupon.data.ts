import { IsOptional, IsString, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICoupon } from '../interface/coupon.if';
import { IModifiedBy } from '../interface/modifyed-by.if';
import { ModifiedByData } from '../data/modified-by.data';
import { CouponRequestDto } from './coupon-request.dto';

export class CouponData extends CouponRequestDto implements ICoupon {
  @ApiProperty({
    description: '類型',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: '發行日期',
    required: false,
  })
  @IsOptional()
  @IsString()
  issueDate?: string;

  @ApiProperty({
    description: '到期日',
    required: false,
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    description: '使用日期',
    required: false,
  })
  @IsOptional()
  @IsString()
  usedDate?: string;

  @ApiProperty({
    description: '優惠說明',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '原始持有者',
    required: false,
  })
  @IsOptional()
  @IsString()
  originalOwner: string;

  @ApiProperty({
    description: '轉為紙本(號碼)',
    required: false
  })
  @IsOptional()
  @IsString()
  toPaperNo: string;

  @ApiProperty({
    description: '櫃枱收券人',
    type: ModifiedByData,
    required: false,
  })
  @IsOptional()
  @IsObject()
  collector: IModifiedBy;
}
