import { ApiProperty } from "@nestjs/swagger";
import { ICoupon } from "../interface/coupon.if";
import { IsString } from "class-validator";

export class Coupon2PaperDto implements Partial<ICoupon> {
    @ApiProperty({
        description: 'coupon id',
        required: true,
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: '紙本優惠券編號',
        required: true,
    })
    @IsString()
    toPaperNo: string;

}