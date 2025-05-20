import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ITempData } from "../interface/common.if";

export type TempDataDocument = TempData & Document;

@Schema()
export class TempData implements ITempData {
    @Prop({ index: true, unique: true })
    code: string;

    @Prop()
    value?: string;
    
    @Prop()
    codeUsage?: string;

    @Prop()
    ts: number;
}

export const TempDataSchema = SchemaFactory.createForClass(TempData);