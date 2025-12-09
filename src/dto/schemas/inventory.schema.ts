import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IInventory } from '../interface/fertilizer.if';
import { Document } from 'mongoose';
import { ICommonLog } from '../interface/common.if';

export type InventoryDocument = Document & Inventory;

@Schema({timestamps: true})
export class Inventory implements IInventory {
    @Prop({
        unique: true,
        index: true,
    })
    id: string;

    @Prop({
        index: true
    })
    name: string;   //品名

    @Prop()
    unit: string;   //單位

    @Prop({
        index: true,
    })
    product_code: string; //產品編號

    @Prop({
        index: true
    })
    category_id: string;    //($uuid)分類 ID

    @Prop()
    alert_quantity:	number; //警示存量

    @Prop()
    unit_price:	number; //單價

    @Prop()
    notes: string; //備註

    @Prop({
        type: Array<Object>
    })
    logs?: ICommonLog[];     
}
export const InventorySchema = SchemaFactory.createForClass(Inventory);
InventorySchema.index({ name: 1, unit: 1}, {unique: true});