import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMemberYearly } from "../interface/report.if";
import { Document } from "mongoose";

export type MemberYearlyDocument = Document & MemberYearly;

@Schema()
export class MemberYearly implements IMemberYearly {
    @Prop({index: true, unique: true, required: true})
    year?:number;

    @Prop()
    totalMembers?: number;

    @Prop()
    newMembers?: number;

    @Prop()
    totalCoupons?: number;

    @Prop()
    usedCoupons?: number;
}

export const MemberYearlySchema = SchemaFactory.createForClass(MemberYearly);