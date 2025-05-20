import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { CouponBatchRequestDto } from './coupon-batch-request.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { COUPON_BATCH_FREQUNCY } from '../../utils/enum';

export class CouponBatchPostDto extends CouponBatchRequestDto implements Partial<ICouponBatch> {
    @ApiProperty({
        description: '優惠說明',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: '優惠-國興碼',
        required: false,
    })
    @IsOptional()
    @IsString()
    mode?: string;

    @ApiProperty({
        description: '發行頻率',
        required: false,
        enum: COUPON_BATCH_FREQUNCY,
        example: COUPON_BATCH_FREQUNCY.MONTHLY,
    })
    @IsOptional()
    @IsString()
    frequency?: string;

    @ApiProperty({
        description: '有效月數',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    validityMonths?: number;

    @ApiProperty({
        description: '每人張數',
        required: true,
        example: 3,
    })
    @IsOptional()
    @IsNumber()
    couponsPerPerson: number;

}