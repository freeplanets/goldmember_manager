import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IEventNews } from "../interface/event-news";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { Document } from "mongoose";
import { ModifiedByData } from "../data/modified-by.data";

export type EventNewsDocument = Document & EventNews;

@Schema()
export class EventNews implements IEventNews {
    @Prop({
        index: true, unique: true,
    })
    id: string;

    @Prop()
    title: string;

    @Prop()
    dateStart: string;

    @Prop()
    dateEnd: string;

    @Prop()
    location: string;

    @Prop()
    description: string;
    
    @Prop({
        type: ModifiedByData,
    })
    creator: IModifiedBy;

    @Prop({
        type: ModifiedByData,
    })
    updater: IModifiedBy;

    @Prop({
        type: ModifiedByData,       
    })
    deleter: IModifiedBy;

    @Prop({
        default: false,
    })
    isDeleted: boolean;

}

export const EventNewsSchema = SchemaFactory.createForClass(EventNews);