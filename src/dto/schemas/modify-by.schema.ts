import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IModifiedBy } from "../interface/modifyed-by.if";

@Schema()
export class ModifyBy implements IModifiedBy {
    @Prop()
    modifiedByWho: string;

    @Prop()
    modifiedBy?: string;

    @Prop()
    modifiedAt?: number;
}

export const ModifyBySchema = SchemaFactory.createForClass(ModifyBy);
