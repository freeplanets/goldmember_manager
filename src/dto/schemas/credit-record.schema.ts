import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ICreditRecord } from "../interface/team-group.if";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { ModifiedByData } from "../data/modified-by.data";

export type CreditRecordDocument = Document & CreditRecord;

@Schema()
export class CreditRecord implements ICreditRecord {
    @Prop({unique:true, required: true })
    id: string; //信用評分紀錄ID

    @Prop({index:true, required: true })
    refId: string; // 參考 ID, 如球隊 ID, 會員 ID 等

    @Prop({required: true })
    date: string;   //日期

    @Prop({required: true })
    score: number; //評分

    @Prop({required: true })
    reason: string; //原因

    @Prop({
        type: ModifiedByData,
        required: true,
    })
    recordedBy:	IModifiedBy; //記錄人員
}

export const CreditRecordSchema = SchemaFactory.createForClass(CreditRecord);