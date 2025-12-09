import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IStockSummary } from '../interface/fertilizer.if';
import { Document } from 'mongoose';

export type InventorySummaryDocument = Document & InventorySummary;

@Schema()
export class InventorySummary implements IStockSummary {
    @Prop({index: true, unique: true})
    id: string;

    @Prop()
    total_in: number;

    @Prop()
    total_out: number;

    @Prop()
    stock: number;
}

export const InventorySummarySchema = SchemaFactory.createForClass(InventorySummary);
