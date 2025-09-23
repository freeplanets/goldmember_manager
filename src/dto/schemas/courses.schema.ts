import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICourse, ITee, ITeeInfo } from '../interface/field-management.if';
import { COURSES_CODE } from '../../utils/enum';
import { TeeData } from '../field-management/tee-data';
import { Document } from 'mongoose';
import { TeeReqDto } from '../field-management/tee-request.dto';
import { TeeSchema } from './tee.schema';

export type CoursesDocument = Document & Courses;

@Schema()
export class Courses implements ICourse {
    @Prop({index:true, unique: true})
    courseIndex: COURSES_CODE;

    @Prop({
        type: Array<String>,
    })
    zones: string[];

    @Prop({
        schema: [TeeSchema],
    })
    tees: ITee[];
    // @Prop({
    //     type: TeeData,
    // })
    // blueTee: ITeeInfo;

    // @Prop({
    //     type: TeeData,
    // })
    // whiteTee: ITeeInfo;

    // @Prop({
    //     type: TeeData,
    // })
    // redTee: ITeeInfo;
    
    @Prop({
        type:Array<String>,
    })
    logs: string[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);