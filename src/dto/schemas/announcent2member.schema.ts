import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IAnnouncement2Member } from "../interface/announcement.if";
import { ANNOUNCEMENT_READ_STATUS } from "../../utils/enum";
import { Document } from "mongoose";

export type Announcement2MemberDocument = Document & Announcement2Member;

@Schema()
export class Announcement2Member implements IAnnouncement2Member {
    @Prop({
        unique: true,
        index: true,
    })
    id: string;

    @Prop({
        index: true,
    })
    memberId: string;

    @Prop()
    announcementId: string;

    @Prop()
    publishDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop({
        enum: ANNOUNCEMENT_READ_STATUS,
        default: ANNOUNCEMENT_READ_STATUS.UNREAD,
    })
    readStatus: ANNOUNCEMENT_READ_STATUS;

    @Prop({
        default: false,
    })
    isDeleted: boolean;

    @Prop({
        default: false,
    })
    isPublished: boolean;
}

export const Announcement2MemberSchema = SchemaFactory.createForClass(Announcement2Member);