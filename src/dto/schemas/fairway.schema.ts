import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IFairway } from '../interface/field-management.if';
import { FAIRWAY_PATH } from '../../utils/enum';

export type FairwayDocument = Document & Fairway;

@Schema()
export class Fairway implements IFairway {
    // @Prop({index: true, unique:true})
    // id: string;
    
    @Prop({
        enum: FAIRWAY_PATH,
        required: true,
    })
    path: FAIRWAY_PATH;

    @Prop({
        required: true,
    })
    fairway: number;

    @Prop()
    blueTee: number;

    @Prop()
    whiteTee: number;

    @Prop()
    redTee: number;

    @Prop()
    par: number;

    @Prop()
    hdp: number;

    @Prop({
        type:Array<String>,
    })
    logs: string[];
}

export const FairwaySchema = SchemaFactory.createForClass(Fairway);
FairwaySchema.index({path: 1, fairway: 1}, {name: 'FairwayPath', unique: true })