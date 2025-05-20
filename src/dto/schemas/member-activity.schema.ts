import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IMemberActivity } from '../interface/member.if';
import { MEMBER_LEVEL } from '../../utils/enum';
import { Document } from 'mongoose';

export type MemberActivityDocument = Document & MemberActivity;

@Schema()
export class MemberActivity implements IMemberActivity {
    @Prop({index: true, required: true})
    year: number;

    @Prop({index: true, required: true})
    month: number;

    @Prop()
    memberId: string;

    @Prop()
    membershipType: MEMBER_LEVEL;

    @Prop()
    lastLogin: number;
}

export const MemberActivitySchema = SchemaFactory.createForClass(MemberActivity);

MemberActivitySchema.index(
    {year: 1, month: 1, memberId:1},
    {unique: true},
)