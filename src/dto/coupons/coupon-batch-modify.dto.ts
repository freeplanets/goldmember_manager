import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { CouponBatchRequestDto } from './coupon-batch-request.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { COUPON_BATCH_FREQUNCY, MEMBER_GROUP } from '../../utils/enum';

export class CouponBatchModifyDto extends CouponBatchRequestDto implements Partial<ICouponBatch> {
    @ApiProperty({
        description: '名稱',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '優惠類型',
        required: false,
    })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({
        description: '發行對象',
        enum: MEMBER_GROUP,
        isArray: true,
        example: [MEMBER_GROUP.ALL],
        required: false,
    })
    @IsOptional()
    @IsArray()
    targetGroups?: MEMBER_GROUP[];

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
        required: false,
        example: 3,
    })
    @IsOptional()
    @IsNumber()
    couponsPerPerson: number;

}