import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IInventoryCategory } from "../interface/fertilizer.if";
import { Document } from "mongoose";
import { ICommonLog } from "../interface/common.if";

export type InventoryCategoryDocument = Document & InventoryCategory;

@Schema({timestamps: true})
export class InventoryCategory implements IInventoryCategory {
    @Prop({
        unique: true,
        index: true,
    })
    id: string;

    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        type: Array<Object>
    })
    logs?: ICommonLog[];
}

export const InventoryCategorySchema = SchemaFactory.createForClass(InventoryCategory);
