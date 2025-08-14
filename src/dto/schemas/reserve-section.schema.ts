import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IReserveSection } from '../interface/reservations.if';
import { CourseName, ReserveStatus, TimeSectionType } from '../../utils/enum';
import { Document } from 'mongoose';

export type ReserveSectionDocument = Document & ReserveSection;

@Schema()
export class ReserveSection implements IReserveSection {
    @Prop({index:true, unique: true})
    id: string;

    @Prop()
    reservationId: string;

    @Prop({index:true})
    refId: string;

    @Prop({index: true})
    date:string;    //($date)日期 (YYYY/MM/DD)

    @Prop({index: true})
    timeSlot:string;    //時段 (HH:MM)

    @Prop({index: true})
    startTime:string;   //開始時間 (HH:MM)

    @Prop({index: true})
    endTime:string; //結束時間 (HH:MM)

    @Prop({index: true})
    course:CourseName;  //球道 Enum:[ west, east, south ]

    @Prop()
    courses:CourseName[];    // 球道列表 (時間範圍預約時使用)

    @Prop({index: true})
    type:TimeSectionType;    //時段類型 (單一時段或時間範圍) Enum:[ timeslot, range ]

    @Prop({})
    status: ReserveStatus;
}

export const ReserveSectionSchema = SchemaFactory.createForClass(ReserveSection);