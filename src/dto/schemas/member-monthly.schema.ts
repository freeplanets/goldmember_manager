import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMemberMonthly } from "../interface/report.if";
import { Document } from "mongoose";

export type MemberMonthlyDocument = Document & MemberMonthly;

@Schema()
export class MemberMonthly implements IMemberMonthly {
    @Prop({index: true})
    year?:number;

    @Prop({index: true})
    month?: number;

    @Prop()
    newMembers?: number;

    @Prop()
    usedCoupons?: number;   
}

export const MemberMonthlySchema = SchemaFactory.createForClass(MemberMonthly);

MemberMonthlySchema.index(
    {year: 1, month: 1},
    {unique: true}
);
