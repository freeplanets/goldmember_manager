import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ILoginToken } from "../interface/auth.if";

export type LoginTokenDocument = Document & LoginToken;

@Schema()
export class LoginToken implements ILoginToken {
    @Prop({ required: true, index: true, unique: true })
    uid: string;
    
    @Prop()
    token: string;

    @Prop()
    lastLoginId?: string;
}
export const LoginTokenSchema = SchemaFactory.createForClass(LoginToken);