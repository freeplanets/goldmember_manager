import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMember, INotificationOptions } from "../interface/member.if";
import { ModifiedByData } from "../data/modified-by.data";
import mongoose, { Document } from "mongoose";
import { GENDER, MEMBER_LEVEL } from "../../utils/enum";
import { IModifiedBy } from "../interface/modifyed-by.if";
import { ILoginDevice } from "../interface/devices.if";
import { LoginDevice } from "../devices/login-device";
import { ICreditRecord } from "../interface/team-group.if";
import { NotificationOptionsSchema } from "./notification-options.schema";

export type MemberDocument = Document & Member;

@Schema()
export class Member implements IMember {
    @Prop({index: true, unique: true})
    id: string;

    @Prop({index: true})
    systemId: string;

    @Prop()
    name: string;

    @Prop()
    displayName: string;

    @Prop()
    password: string;

    @Prop({
        default: 0,
    })
    passwordLastModifiedTs: number;

    @Prop({
        enum: GENDER,
    })
    gender?: GENDER;

    @Prop()
    birthDate: string;

    @Prop()
    birthMonth: number;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop()
    handicap: number;
    
    @Prop()
    pic: string;

    @Prop({
        enum: MEMBER_LEVEL,
        default: MEMBER_LEVEL.GENERAL_MEMBER,
    })
    membershipType: MEMBER_LEVEL;

    @Prop({
        type: ModifiedByData,
    })
    membershipLastModified: IModifiedBy;

    @Prop()
    mobileType: string;

    @Prop()
    mobileId: string;

    @Prop()
    joinDate: string;

    @Prop()
    expiryDate: string;

    @Prop()
    notes: string;

    @Prop()
    lastLogin: number;
    
    @Prop()
    lastLoginIp: string;

    @Prop({ default: false })
    isDirector: boolean;
    
    @Prop()
    refSystemId: string;

    @Prop({
        type: ModifiedByData, 
    })
    directorStatusLastModified?: IModifiedBy;

    @Prop({
        default: false,
    })
    isLocked: boolean;

    @Prop({
        default: 0,
    })
    passwordFailedCount: number;

    @Prop({
        default: 0,
    })
    passwordLastTryTs: number;
    
    @Prop({
        default: 0,
    })
    announcementReadTs?: number;
    
    @Prop({
        type:Array<Partial<LoginDevice>>
    })
    devices: Partial<ILoginDevice>[];

    @Prop()
    isCouponTriggered: boolean;

    @Prop({
        default: 100,
    })
    creditScore: number;    //信用評分

    @Prop({
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'CreditRecord' 
        }],
        default: [],
    })
    creditHistory?: ICreditRecord[];

    @Prop({
        type: NotificationOptionsSchema,
    })
    NotifyOptions: INotificationOptions;

}

export const MemberSchema = SchemaFactory.createForClass(Member);