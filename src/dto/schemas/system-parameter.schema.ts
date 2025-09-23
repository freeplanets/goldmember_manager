import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParamTypes } from '../../utils/settings/settings.enum';
import { IGrading, INofication, IParameter, ITimeslotsValue, IValueScore } from '../../utils/settings/settings.if';
import { AnyObject } from '../interface/common.if';

export type SystemParameterDocument = Document & SystemParameter;

@Schema()
export class SystemParameter implements IParameter<IValueScore | INofication | IGrading | ITimeslotsValue|AnyObject> {
    @Prop({
        unique: true, 
        index: true,
        // enum: ParamTypes
    })
    id: string;
    //id: ParamTypes;

    @Prop()
    key: string;

    @Prop({
        type: Object,
    })
    value: IValueScore | INofication | IGrading | ITimeslotsValue;

    @Prop()
    description: string;
}

export const SystemParameterSchema = SchemaFactory.createForClass(SystemParameter);