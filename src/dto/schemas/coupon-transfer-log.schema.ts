import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICouponTransferLog } from '../interface/coupon.if';
import { Document } from 'mongoose';

export type CouponTransferLogDocument = Document & CouponTransferLog;

@Schema()
export class CouponTransferLog implements ICouponTransferLog {
    @Prop({index: true, unique:true })
    id: string;

    @Prop({index: true})
    couponId: string;

    @Prop()
    newOwner: string;

    @Prop()
    newOwnerId: string;

    @Prop()
    originalOwner: string;

    @Prop()
    originalOwnerId: string;

    @Prop()
    transferDate: string;

    @Prop()
    transferDateTS: number;
}

export const CouponTransferLogSchema = SchemaFactory.createForClass(CouponTransferLog);