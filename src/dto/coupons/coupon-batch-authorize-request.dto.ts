import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class CouponbatchAuthorizeReqDto implements Partial<ICouponBatch> {
    @ApiProperty({
        description: '發行日期',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    issueDate?: string;
}