import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IReservationParticipant, IReservations, IReserveHistory, IReserveSection } from '../interface/reservations.if';
import { MEMBER_LEVEL, ReserveFrom, ReserveStatus, ReserveType } from '../../utils/enum';
//import { ReserveHistory } from '../reservations/reserve-history';
import mongoose, { Document, Mongoose } from 'mongoose';

export type ReservationsDocument = Document & Reservations;

@Schema()
export class Reservations implements IReservations {
    @Prop({index: true, unique: true})
    id:string;  //預約 ID
    
    @Prop({
        enum: ReserveType,
    })
    type:ReserveType;    //預約類型 (球隊或個人)Enum:[ team, individual ]

    @Prop({index: true})
    teamId:string;  //球隊 ID (球隊預約時使用)


    @Prop()
    teamName:string;    //球隊名稱 (球隊預約時使用)

    @Prop()
    contactPerson:string;   //聯絡人姓名

    @Prop()
    contactPhone:string;    //聯絡人電話

    @Prop({index: true})
    memberId:string;    //會員 ID (個人預約時使用)

    @Prop()
    memberName:string;  //會員姓名 (個人預約時使用)

    @Prop()
    memberPhone:string; //會員電話 (個人預約時使用)

    @Prop({
        enum: MEMBER_LEVEL,
    })
    membershipType:MEMBER_LEVEL;  //會員類型 (個人預約時使用)

    @Prop()
    playerCount:number; //參與人數 (個人預約時使用)

    @Prop({
        type: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'Participant'}
        ]
    })
    participants: IReservationParticipant[];   //參與人員名單 (個人預約時使用)

    // @Prop({
    //     $size: '$participants',
    // })
    @Prop()
    partCount: number;  // 實際人數 count from participants

    @Prop()
    groups:number;  //組數

    @Prop({
        type:[ {type:mongoose.Schema.Types.ObjectId, ref: 'ReserveSection'}]
    })
    data: Partial<IReserveSection>[]; //預約時段資料

    @Prop()
    notes:string;   //備註

    @Prop({
        enum: ReserveStatus,
    })
    status:ReserveStatus;  //預約狀態 

    @Prop()
    createdAt:string;   //($date-time)建立時間

    @Prop({
        enum: ReserveFrom,
    })
    reservedFrom:ReserveFrom;    //預約來源

    @Prop({
        type: Array<Partial<IReserveHistory>>
    })
    history: Partial<IReserveHistory>[];
}

export const ReservationsSchema = SchemaFactory.createForClass(Reservations);