import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ICouponStats } from "../interface/report.if";
import { Document } from "mongoose";

export type CouponStatsDocument = Document & CouponStats;

@Schema()
export class CouponStats implements ICouponStats {
    @Prop({index: true, required: true})
    year:number;

    @Prop({index: true, required: true})
    month:number;
    
    @Prop({index: true, required: true})
    type: string;

    @Prop()
    electronicCount?: number;

    @Prop()
    electronicUsed?: number;

    @Prop()
    electronicInvalid?: number;

    @Prop()
    electronicExpired?: number;

    @Prop()
    electronicUnused?: number;

    @Prop()
    paperCount?: number;

    @Prop()
    paperUsed?: number;

    @Prop()
    paperInvalid?: number;

    @Prop()
    paperExpired?: number;

    @Prop()
    paperUnused?: number; 
}

export const CouponStatsSchema = SchemaFactory.createForClass(CouponStats);

CouponStatsSchema.index(
    { year: 1, month: 1, type: 1 },
    { unique: true },
);

