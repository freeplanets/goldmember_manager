import { IsOptional, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponData } from '../coupons/coupon.data';

export class inlineResponse200Data {
  @ApiProperty({
    description: '',
    required: false,
    example: new CouponData(),
  })
  @IsOptional()
  @IsObject()
  coupon?: CouponData = new CouponData();

  @ApiProperty({
    description: '列印檔案的URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  printUrl?: string;
}
