import { ApiProperty } from "@nestjs/swagger";
import { ICouponBatch } from "../interface/coupon.if";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ANNOUNCEMENT_GROUP, COUPON_ISSUANCE_METHOD } from "../../utils/enum";

export class CouponBatchRequestDto implements Partial<ICouponBatch> {
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
        description: '發行方式',
        enum: COUPON_ISSUANCE_METHOD,
        example: COUPON_ISSUANCE_METHOD.AUTOMATIC,
        default: COUPON_ISSUANCE_METHOD.MANUAL,
    })
    @IsOptional()
    @IsNumber()
    issueMode?: COUPON_ISSUANCE_METHOD;

    @ApiProperty({
    description: '發行對象',
    enum: ANNOUNCEMENT_GROUP,
    })
    issueTarger?: ANNOUNCEMENT_GROUP;

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
        description: '狀態',
        required: false,
    })
    @IsOptional()
    @IsString()
    status?: string;
}