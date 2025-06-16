import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IAnnouncement, IAttachmemt } from "../interface/announcement.if";
import { MEMBER_EXTEND_GROUP, MEMBER_GROUP } from "../../utils/enum";
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
    type?: string;

    @Prop()
    publishDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop()
    isPublished?: boolean;

    @Prop()
    isTop?: boolean;

    @Prop()
    iconType?: string;

    @Prop({
        type: Array<Attachment>,
    })
    attachments?: IAttachmemt[];

    @Prop({
        type: Array<String>,
        enum: MEMBER_GROUP
    })
    targetGroups: MEMBER_GROUP[];

    @Prop({
      enum: MEMBER_EXTEND_GROUP,
      type: Array<MEMBER_EXTEND_GROUP>,  
    })
    extendFilter?: MEMBER_EXTEND_GROUP[];
    
    @Prop()
    birthMonth: number;
    
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
    authorizer: IModifiedBy;

    @Prop({

    })
    publishedTs: number;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);