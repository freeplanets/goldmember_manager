import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUserAccessLog } from "../interface/user.if";

export type UserAccessLogDocument = Document & UserAccessLog;

@Schema()
export class UserAccessLog implements IUserAccessLog {
    @Prop({index: true})
    username: string;

    @Prop()
    path: string;

    @Prop()
    token: string;

    @Prop({
        type: Object,
    })
    body: any;

    @Prop({
        type: Object,
    })
    query: any;

    @Prop()
    accessDate: string;
    
    @Prop()
    accessTime:string;

    @Prop()
    accessTimeTS: number;
}

export const UserAccessLogSchema = SchemaFactory.createForClass(UserAccessLog);