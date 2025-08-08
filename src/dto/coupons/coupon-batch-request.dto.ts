import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { IsArray, IsOptional, IsString, Matches } from 'class-validator';
import { COUPON_BATCH_ISSUANCE_METHOD, MEMBER_GROUP, MEMBER_EXTEND_GROUP } from '../../utils/enum';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';
import { DateLocale } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export class CouponBatchRequestDto implements Partial<ICouponBatch> {
    @ApiProperty({
        description: '名稱',
        required: true,
    })
    @IsString()
    name?: string;

    @ApiProperty({
        description: '優惠類型',
        required: true,
    })
    @IsString()
    type?: string;

    @ApiProperty({
        description: '發行方式',
        required: false,
        enum: COUPON_BATCH_ISSUANCE_METHOD,
        example: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC,
        default: COUPON_BATCH_ISSUANCE_METHOD.MANUAL,
    })
    @IsOptional()
    @IsString()
    issueMode?: COUPON_BATCH_ISSUANCE_METHOD;

    @ApiProperty({
        description: '發行對象',
        enum: MEMBER_GROUP,
        isArray: true,
        example: [MEMBER_GROUP.ALL],
        required: true,
    })
    @IsArray()
    targetGroups?: any[];
    
    @ApiProperty({
        description: '進階選項,目前為生日',
        required: false,
        isArray: true,
        enum: MEMBER_EXTEND_GROUP,
        example: [MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH],
    })
    @IsOptional()
    @IsArray()
    extendFilter?: MEMBER_EXTEND_GROUP[];

    @ApiProperty({
        description: '發行日期',
        required: false,
        example: myDate.toDateString(),
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    issueDate?: string;

    @ApiProperty({
        description: '到期日',
        required: false,
        example: myDate.toDateString(new Date(Date.now() + 90*24*60*60*1000)),
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    expiryDate?: string;
}