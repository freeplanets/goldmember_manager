import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICouponAutoIssuedLog } from '../interface/coupon.if';

export type CouponAutoIssuedLogDocument = Document & CouponAutoIssuedLog; 

@Schema()
export class CouponAutoIssuedLog implements ICouponAutoIssuedLog {
    @Prop({required: true, unique: true, index: true})
    BatchId: string;

    @Prop()
    name?: string;

    @Prop()
    type?: string;

    @Prop()
    issueDate?: string;

    @Prop({index: true})
    originBatchId?: string;

    @Prop()
    totalCoupons?: number;

    @Prop()
    issueDateTs?: number;   
}

export const CouponAutoIssuedLogSchema = SchemaFactory.createForClass(CouponAutoIssuedLog);