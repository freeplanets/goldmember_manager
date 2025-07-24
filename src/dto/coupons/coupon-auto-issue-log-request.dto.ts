import { ApiProperty } from "@nestjs/swagger";
import { ICouponAutoIssuedLog } from "../interface/coupon.if";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CouponAutoIssueLogReqDto implements Partial<ICouponAutoIssuedLog>{
    @ApiProperty({
        description: '優惠券代號',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    batchId: string;

    @ApiProperty({
        description: '名稱',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '類型',
        required: false,
    })
    @IsOptional()
    @IsString()
    type?: string;
}