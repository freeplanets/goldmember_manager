import { ApiProperty } from "@nestjs/swagger";
import { ICoupon } from "../interface/coupon.if";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { COUPON_STATUS } from "../../utils/enum";

export class CouponRequestDto implements Partial<ICoupon> {
    @ApiProperty({
        description: '編號',
        required: false,
    })
    @IsOptional()
    @IsString()
    id?: string;
    
    @ApiProperty({
        description: '會員編號',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberId?: string;

    @ApiProperty({
        description: '使用狀態',
        enum: COUPON_STATUS,
        example: COUPON_STATUS.NOT_USED,
        default: COUPON_STATUS.NOT_ISSUED,
    })
    @IsOptional()
    @IsEnum(COUPON_STATUS)
    status: COUPON_STATUS;
}