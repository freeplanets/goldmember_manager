import { ApiProperty } from '@nestjs/swagger';
import { ICouponBatch } from '../interface/coupon.if';
import { IsOptional, IsString } from 'class-validator';
import { BIRTH_OF_MONTH, COUPON_BATCH_ISSUANCE_METHOD, MEMBER_GROUP } from '../../utils/enum';
import { DateLocale } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export class CouponBatchListRequestDto implements Partial<ICouponBatch> {
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
        description: `發行對象的生日月份`,
        required: false,
        enum: BIRTH_OF_MONTH,
        example: BIRTH_OF_MONTH.APRIL,
    })
    birthMonth?: BIRTH_OF_MONTH;

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
        required: false,
    })
    @IsOptional()
    @IsString()
    issueTarget?: MEMBER_GROUP[];

    @ApiProperty({
        description: '發行日期',
        required: false,
        example: myDate.toDateString(),
    })
    @IsOptional()
    @IsString()
    issueDate?: string;

    @ApiProperty({
        description: '到期日',
        required: false,
        example: myDate.toDateString(new Date(Date.now() + 90*24*60*60*1000)),
    })
    @IsOptional()
    @IsString()
    expiryDate?: string;
}