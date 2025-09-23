import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ITee } from "../interface/field-management.if";

@Schema()
export class Tee implements ITee {
    @Prop()
    tee: string;

    @Prop()
    rating: number;

    @Prop()
    slope: number;
}

export const TeeSchema = SchemaFactory.createForClass(Tee);