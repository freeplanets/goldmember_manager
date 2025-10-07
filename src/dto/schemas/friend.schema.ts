import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IFriend } from '../interface/social.if';
import mongoose, { Document } from 'mongoose';

export type FriendDocument = Document & Friend;

@Schema()
export class Friend implements IFriend {
    @Prop({index: true, undefined:true})
    id:string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        select: 'id name pic',
    })
    memberInfo: string;

    @Prop({index: true})
    memberId: string;

    @Prop()
    nickname: string;

    @Prop()
    occurTS: number;
}
export const FriendSchema = SchemaFactory.createForClass(Friend);
FriendSchema.index(
    { memberInfo: 1, memberId: 1},
    {unique: true}
)