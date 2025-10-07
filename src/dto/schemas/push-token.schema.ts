import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPushToken } from '../interface/member.if';

export type PushTokenDocument = Document & PushToken;

@Schema({timestamps: true})
export class PushToken implements IPushToken {
    @Prop({index: true, unique: true})
    deviceId: string;

    @Prop({index: true})
    userId: string;

    @Prop()
    expoPushToken: string;

    @Prop()
    nativePushToken: string;

    @Prop()
    platform: string;
}

export const PushTokenSchema = SchemaFactory.createForClass(PushToken);