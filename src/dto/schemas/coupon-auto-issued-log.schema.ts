import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICouponAutoIssuedLog } from '../interface/coupon.if';
import { COUPON_BATCH_STATUS } from '../../utils/enum';
import { IModifiedBy } from '../interface/modifyed-by.if';
import { ModifiedByData } from '../data/modified-by.data';

export type CouponAutoIssuedLogDocument = Document & CouponAutoIssuedLog; 

@Schema()
export class CouponAutoIssuedLog implements ICouponAutoIssuedLog {
    @Prop({required: true, index: true})
    batchId: string;

    @Prop()
    name?: string;

    @Prop()
    type?: string;

    @Prop()
    issueDate?: string;

    // @Prop({index: true})
    // originBatchId?: string;

    @Prop()
    totalCoupons?: number;

    @Prop()
    issueDateTs?: number;

    @Prop()
    numberOfIssuers: number;
    
    @Prop()
    numberOfIssued: number;

    @Prop()
    status?: COUPON_BATCH_STATUS;

    @Prop({
        type: ModifiedByData,
    })
    authorizer: IModifiedBy;
}

export const CouponAutoIssuedLogSchema = SchemaFactory.createForClass(CouponAutoIssuedLog);

CouponAutoIssuedLogSchema.index(
    {batchId: 1, issueDate: 1},
    {unique: true},
)
