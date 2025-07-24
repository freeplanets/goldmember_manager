import { Prop, PropOptions, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ICouponBatch } from "../interface/coupon.if";
import { MEMBER_GROUP, BIRTH_OF_MONTH, COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, MEMBER_EXTEND_GROUP } from "../../utils/enum";
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

    @Prop({
        enum: BIRTH_OF_MONTH,
    })
    birthMonth?: BIRTH_OF_MONTH;

    @Prop()
    mode?: string;

    @Prop()
    frequency?: string;

    @Prop()
    validityMonths?: number;

    @Prop()
    couponsPerPerson?: number;

    @Prop({
        enum: COUPON_BATCH_ISSUANCE_METHOD,
        default: COUPON_BATCH_ISSUANCE_METHOD.MANUAL,
    })
    issueMode: COUPON_BATCH_ISSUANCE_METHOD; // 手動, 自動

    @Prop()
    numberOfIssued: number;     //發行張數

    @Prop()
    numberOfIssuers: number;    //發行人數

    @Prop({
        // enum: MEMBER_GROUP,
        // type: Array<MEMBER_GROUP>,
    })
    targetGroups: any[];

    @Prop({
        enum: MEMBER_EXTEND_GROUP,
        type: Array<MEMBER_EXTEND_GROUP>,
    })
    extendFilter?: MEMBER_EXTEND_GROUP[];

    @Prop()
    issueDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop({
        enum: COUPON_BATCH_STATUS,
        default: COUPON_BATCH_STATUS.NOT_ISSUED,

    })
    status?: COUPON_BATCH_STATUS;

    @Prop({
        index: true,
    })
    originId?: string;

    @Prop({
        default: false,
    })
    couponCreated?: boolean;

    @Prop({
        type: ModifiedByData,
    })
    creator: IModifiedBy;

    @Prop({
        type: ModifiedByData,
    })
    authorizer: IModifiedBy;

    @Prop({
        type: ModifiedByData,
    })
    updater: IModifiedBy;
}

export const CouponBatchSchema = SchemaFactory.createForClass(CouponBatch);