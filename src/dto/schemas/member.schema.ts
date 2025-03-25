import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IMember } from "../interface/member.if";
import { ModifiedByData } from "../data/modified-by.data";
import { Document } from "mongoose";
import { DS_LEVEL, GENDER, MEMBER_LEVEL } from "../../utils/enum";

export type MemberDcoument = Document & Member;

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
        enum: GENDER,
    })
    gender?: GENDER;

    @Prop()
    birthDate: string;

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

    @Prop()
    membershipLastModified: ModifiedByData;

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
    lastVisit: string;

    @Prop({
        enum: DS_LEVEL,
        default: DS_LEVEL.NONE,
    })
    isDirector: DS_LEVEL;
    
    @Prop()
    refSystemId: string;

    @Prop()
    directorStatusLastModified?: ModifiedByData;
}

export const MemberSchema = SchemaFactory.createForClass(Member);