import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IHoliday } from "../interface/common.if";
import { Document } from "mongoose";

export  type HolidayDocument = Document & Holiday;

@Schema({ timestamps: true })
export class Holiday implements IHoliday {
    @Prop({ index: true, required: true })
    year: number;

    @Prop({ index: true, required: true })
    date: string;

    @Prop()
    name: string;

    @Prop({ default: true })
    isHoliday: boolean;

    @Prop()
    holidayCategory: string;

    @Prop()
    description: string;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);

HolidaySchema.index({ year: 1, date: 1 }, {name: 'YearDate', unique: true });
    