import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IAnnouncement, IAttachmemt } from "../interface/announcement.if";
import { ANNOUNCEMENT_GROUP, ANNOUNCEMENT_TYPE, SEARCH_GROUP_METHOD } from "../../utils/enum";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { ModifiedByData } from "../data/modified-by.data";
import { Attachment } from "../announcements/attachment";
import { Document } from "mongoose";

export type AnnouncementDocument = Document & Announcement;

@Schema()
export class Announcement implements IAnnouncement {
    @Prop({index: true, required: true, unique: true})
    id?: string;

    @Prop()
    title?: string;

    @Prop()
    content?: string;

    @Prop({
        type: String,
    })
    type?: ANNOUNCEMENT_TYPE;

    @Prop()
    publishDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop()
    isPublished?: boolean;

    @Prop()
    isTop?: boolean;

    @Prop()
    iconType: string;

    @Prop({
        type: [Attachment],
    })
    attachments?: [IAttachmemt];

    @Prop({
        type: Array<String>,
        enum: ANNOUNCEMENT_GROUP
    })
    targetGroups: [ANNOUNCEMENT_GROUP];

    @Prop({
        type: String,
        enum: SEARCH_GROUP_METHOD,
    })
    method?: SEARCH_GROUP_METHOD;

    @Prop({
        type: ModifiedByData
    })
    creator: IModifiedBy;

    @Prop({
        type: ModifiedByData
    })    
    updater: IModifiedBy;

    @Prop({
        type: ModifiedByData
    })
    apprevor:IModifiedBy;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);