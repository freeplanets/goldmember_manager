import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IIrrigationDecisions } from "../interface/field-management.if";
import { ModifiedByData } from "../data/modified-by.data";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { Document } from "mongoose";

export type IrrigationDecisionsDocument = Document & IrrigationDecisions;

@Schema()
export class IrrigationDecisions implements IIrrigationDecisions {
    @Prop({index: true, unique: true})
    id: string;

    @Prop({index: true})
    date: string;

    @Prop()
    greenId: string;

    @Prop()
    rain24h: number;

    @Prop()
    tmax: number;

    @Prop()
    windSpeed: number;

    @Prop()
    et0: number;

    @Prop()
    sm5cm: number;

    @Prop()
    sm12cm: number;

    @Prop()
    sm20cm: number;

    @Prop()
    decisionAM: number;

    @Prop()
    decisionPM: number;

    @Prop()
    mode: string;
    
    @Prop()
    comments: string;

    @Prop()
    recordedBy: string;

    @Prop()
    recordedAt: string;

    @Prop()
    recordedAtTS: number;

    @Prop({
        type:Array<String>,
    })
    logs: string[];
}

export const IrrigationDecisionsSchema = SchemaFactory.createForClass(IrrigationDecisions);