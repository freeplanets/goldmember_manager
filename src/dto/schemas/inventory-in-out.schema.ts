import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IStockInOut } from '../interface/fertilizer.if';
import { Document } from 'mongoose';

export type InventoryInOutDocument = Document & InventoryInOut;

@Schema()
export class InventoryInOut implements IStockInOut {
    @Prop({index: true, unique:true})
    id:	string; //($uuid)

    @Prop({index: true})
    date: string;   //($date)進貨日期

    @Prop({index: true})
    product_id:	string; //($uuid)

    @Prop({index: true})
    product_name: string;   //

    @Prop()
    product_unit: string;   //


    @Prop()
    quantity: number;   //數量

    @Prop()
    method: string; // 購買、領貨、退回、其他

    @Prop()
    calMark: 1 | -1;

    @Prop()
    creator: string;    //建立者

    @Prop()
    handler: string;    //經辦人

    @Prop()
    notes: string;  //備註    
}

export const InventoryInOutSchema = SchemaFactory.createForClass(InventoryInOut);