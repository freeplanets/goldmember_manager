import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ICouponBatch } from "../interface/coupon.if";
import { ANNOUNCEMENT_GROUP, COUPON_ISSUANCE_METHOD } from "../../utils/enum";
import { ModifiedByData } from "../data/modified-by.data";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { Document } from "mongoose";

export type CouponBatchDocument = Document & CouponBatch;

@Schema()
export class CouponBatch implements ICouponBatch {
    @Prop({index: true, unique: true})
    id?: string;

    @Prop()
    name?: string;

    @Prop()
    description?: string;

    @Prop()
    type?: string;

    @Prop()
    mode?: string;

    @Prop()
    frequency?: string;

    @Prop()
    validityMonths?: number;

    @Prop()
    couponsPerPerson?: number;

    @Prop({
        enum: COUPON_ISSUANCE_METHOD,
        default: COUPON_ISSUANCE_METHOD.MANUAL,
    })
    issueMode: COUPON_ISSUANCE_METHOD; // 0 手動, 1 自動

    @Prop({
        enum: ANNOUNCEMENT_GROUP,
    })
    issueTarger: ANNOUNCEMENT_GROUP;    // 發行對項

    @Prop()
    issueDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop()
    status?: string;

    @Prop()
    targetDescription?: string;

    @Prop({
        type: ModifiedByData,
    })
    authorizer: IModifiedBy;
    
    @Prop({
        type: ModifiedByData
    })
    canceler:IModifiedBy;    
}

export const CouponBatchSchema = SchemaFactory.createForClass(CouponBatch);