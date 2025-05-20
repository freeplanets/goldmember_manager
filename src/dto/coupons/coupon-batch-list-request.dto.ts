import { ICouponBatch } from '../interface/coupon.if';
import { AnnouncementSearch } from '../announcements/announcements-search.dto';
import { COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS } from '../../utils/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class CouponBatchListRequestDto extends AnnouncementSearch implements Partial<ICouponBatch> {
    @ApiProperty({
        description: '狀態',
        required: false,
        enum: COUPON_BATCH_STATUS,
        example: COUPON_BATCH_STATUS.NOT_ISSUED,
    })
    status?: COUPON_BATCH_STATUS;

    @ApiProperty({
        description: '發生方式',
        required: false,
        enum: COUPON_BATCH_ISSUANCE_METHOD,
        example: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC,
    })
    issueMode?: COUPON_BATCH_ISSUANCE_METHOD;
}