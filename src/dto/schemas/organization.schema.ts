import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IOrganization } from '../interface/common.if';
import { ORGANIZATION_TYPE } from '../../utils/enum';

@Schema()
export class Organization implements IOrganization {
    @Prop({
        index: true,
    })
    id: string;

    @Prop({
        index: true,
        enum: ORGANIZATION_TYPE,
    })
    type: ORGANIZATION_TYPE;

    @Prop()
    name: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
