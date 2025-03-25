import { ApiProperty } from "@nestjs/swagger";
import { ICouponBatch } from "../interface/coupon.if";
import { CouponBatchRequestDto } from "./coupon-batch-request.dto";
import { IsNumber, IsOptional, IsString } from "class-validator";

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
    })
    @IsOptional()
    @IsNumber()
    couponsPerPerson?: number;

    @ApiProperty({
        description: '發行目標說明',
        required: false,
    })
    @IsOptional()
    @IsString()
    targetDescription?: string;
}