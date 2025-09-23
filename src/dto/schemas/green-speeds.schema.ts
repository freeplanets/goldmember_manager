import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGreenSpeeds } from '../interface/field-management.if';
import { AnyObject, Document } from 'mongoose';

export type GreenSpeedsDocument = Document & GreenSpeeds;

@Schema()
export class GreenSpeeds implements IGreenSpeeds {
    @Prop({index: true, unique: true})
    id: string;

    @Prop({index:true, unique: true})
    date: string;

    @Prop()
    westSpeed: number;

    @Prop()
    southSpeed: number;

    @Prop()
    eastSpeed: number;

    @Prop()
    notes: string;

    @Prop()
    recordedBy: string;

    @Prop()
    recordedAt: string;

    @Prop()
    recordedAtTS: number;

    @Prop({
        type: Array<String>,
    })
    logs: string[];
}

export const GreenSpeedsSchema = SchemaFactory.createForClass(GreenSpeeds);