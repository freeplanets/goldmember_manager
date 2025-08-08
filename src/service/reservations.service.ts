import { Injectable } from '@nestjs/common';
import { ReservationsResponse } from '../dto/reservations/reservations-response';
import { ErrCode } from '../utils/enumError';
import { ReservationsQueryRequestDto } from '../dto/reservations/reservations-query-request.dto';
import mongoose, { Model } from 'mongoose';
import { Reservations, ReservationsDocument } from '../dto/schemas/reservations.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { IReservations, IReserveHistory, IReserveSection } from '../dto/interface/reservations.if';
import { ReserveSection, ReserveSectionDocument } from '../dto/schemas/reserve-section.schema';
import { IUser } from '../dto/interface/user.if';
import { ReservationResponse } from '../dto/reservations/reservation-response';
import { ReservationModifyRequestDto } from '../dto/reservations/reservation-modify-request.dto';
import { ReservationStatusRequestDto } from '../dto/reservations/reservation-status.request.dto';
import { ParticipantsResponse } from '../dto/reservations/participants-response';
import { IMember } from '../dto/interface/member.if';
import { ParticipantData } from '../dto/reservations/participant.data';
import { DateLocale } from '../classes/common/date-locale';
import { ReserveOp } from '../classes/reservation/reverve-op';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
// import { BaseOp } from '../classes/eventnews/event-news-op';
// import { FuncWithTryCatch } from '../classes/common/func.def';

@Injectable()
export class ReservationsService {
    private myDate = new DateLocale();
    private revOp:ReserveOp;
    constructor(
        @InjectModel(Reservations.name) private readonly modelReserve:Model<ReservationsDocument>,
        @InjectModel(ReserveSection.name) private readonly modelRS:Model<ReserveSectionDocument>,
        @InjectConnection() private readonly connection:mongoose.Connection,
    ){
        this.revOp = new ReserveOp(modelReserve, modelRS, connection);
    }
    async getReservations(qryParam:ReservationsQueryRequestDto):Promise<ReservationsResponse> {
        return FuncWithTryCatchNew(this.revOp, 'get', qryParam);
        // const comRes = new ReservationsResponse();
        // try {
        //     const filters:FilterQuery<ReservationsDocument> = {};
        //     if (qryParam.status && qryParam.status !== ReserveStatus.ALL) {
        //         filters.status = qryParam.status;
        //     }
        //     if (qryParam.type && qryParam.type !== ReserveType.ALL) {
        //         filters.type = qryParam.type;
        //     }
        //     if (!qryParam.endDate) {
        //         qryParam.endDate = qryParam.startDate;
        //     }
        //     filters.createdAt = {
        //         $gte: `${qryParam.startDate} 00:00:00`,
        //         $lte: `${qryParam.endDate} 23:59:59`,
        //     }
        //     const path = 'data';
        //     console.log('filters:', filters);
        //     // return FuncWithTryCatch(this.op.list, filters, path);
        //     comRes.data = await this.modelReserve.find(filters).populate(path);
        // } catch (error) {
        //     console.log('getReservations error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }

    async createReservation(createResv:Partial<IReservations>, user:IUser):Promise<CommonResponseDto> {
        return FuncWithTryCatchNew(this.revOp, 'create', createResv, user);
        // const comRes = new CommonResponseDto();
        // try {
        //     console.log('createResv:', createResv);
        //     const datas = createResv.data;
        //     const isExisted = await this.timeSectionCheck(datas);
        //     console.log('isExisted:',isExisted);
        //     if (!isExisted) {
        //         createResv.id = uuidv1();
        //         datas.forEach((data) => {
        //             data.id = uuidv1();
        //             data.reservationId = createResv.id;
        //         })
        //         const secDatas = await this.modelRS.insertMany(datas);
        //         if (secDatas.length > 0) {
                    
        //             createResv.data = secDatas.map((_id) => _id);
        //             const dt = this.myDate.toDateTimeString().split(' ');
        //             const his:IReserveHistory = {
        //                 date: dt[0],
        //                 time: dt[1],
        //                 id: user.id,
        //                 name: user.username,
        //                 action: ReserveStatus.BOOKED,
        //             };
        //             createResv.reservedFrom = ReserveFrom.BACKEND;
        //             createResv.createdAt = this.myDate.toDateTimeString();
        //             createResv.history = [his];
        //             const cr = await this.modelReserve.create(createResv);
        //             console.log('createReservation:', cr);
        //         }
        //     } else {
        //         comRes.ErrorCode = ErrCode.SELECTED_TIME_SECTION_ASSIGNED;
        //     }
        // } catch (error) {
        //     console.log('createReservation error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }
    async getReservationById(id:string):Promise<ReservationResponse> {
        return FuncWithTryCatchNew(this.revOp, 'getById', id);
        // const comRes = new ReservationResponse();
        // try {
        //     comRes.data = await this.modelReserve.findOne({id});
        // } catch(error) {
        //     console.log('getReservationById:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }
    async modifyReservation(id:string, mfyResv:ReservationModifyRequestDto, user:IUser):Promise<CommonResponseDto> {
        return FuncWithTryCatchNew(this.revOp, 'modify', id, mfyResv, user);
        // const comRes = new CommonResponseDto();
        // try {
        //     const data:Partial<IReservations> = {};
        //     let isDataChanged = false;
        //     Object.keys(mfyResv).forEach((key) => {
        //         if (mfyResv[key]) {
        //             data[key] = mfyResv[key];
        //             isDataChanged = true;
        //         }
        //     });
        //     if (isDataChanged) {
        //         const upd = await this.modelReserve.updateOne({id}, data);
        //         console.log('modifyReservation upd:', upd);
        //         if (upd.modifiedCount === 0) {
        //             comRes.ErrorCode = ErrCode.MISS_PARAMETER;
        //             comRes.error.extra = 'No data changed , check your params, please!';
        //         }
        //     } else {
        //         comRes.ErrorCode = ErrCode.MISS_PARAMETER;
        //     }
        // } catch (error) {
        //     console.log('modifyReservation error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }
    // async timeSectionCheck(datas:Partial<IReserveSection>[]) {
    //     let filter:FilterQuery<ReserveSectionDocument>;
    //     let isExisted = false;
    //     for (let i=0, n=datas.length; i<n; i++) {
    //         const data = datas[i];
    //         if (data.type === TimeSectionType.TIMESLOT) {
    //             // check timeslot
    //             filter = {};
    //             filter.date = data.date;
    //             filter.timeSlot = data.timeSlot;
    //             filter.course = data.course;
    //             filter.type = TimeSectionType.TIMESLOT;
    //             let f = await this.modelRS.findOne(filter);
    //             console.log('createReservation find1:', f, filter);
    //             if (f) {
    //                 isExisted = true;
    //                 break;
    //             }
    //             // check timeslot in time range
    //             filter = {}
    //             filter.date = data.date;
    //             filter.type = TimeSectionType.RANGE;
    //             filter.course = data.course;
    //             filter.$and = [
    //                 //{$gte: [data.timeSlot, '$startTime']},
    //                 //{$lte: [data.timeSlot, '$endTime']},
    //                 {startTime: {$lte: data.timeSlot}},
    //                 {endTime: {$gte: data.timeSlot}},
    //             ]
    //             // console.log('createReservation find2:', f, filter);
    //             f = await this.modelRS.findOne(filter);
    //             console.log('createReservation find2:', f, filter);
    //             if (f) {
    //                 isExisted = true;
    //                 break;
    //             }
    //         } else {
    //             // check range include timeslot
    //             filter = {};
    //             filter.date = data.date;
    //             filter.course = data.course;
    //             filter.type = TimeSectionType.TIMESLOT;
    //             filter.$and = [
    //                 //{ $gte: [ '$timeSlot', data.startTime ]},
    //                 //{ $lte: [ '$timeSlot', data.endTime ]},
    //                 { timeSlot: {$gte: data.startTime}},
    //                 { timeSlot: {$lte: data.endTime}},
    //             ]
    //             let f = await this.modelRS.find(filter);
    //             console.log('createReservation find3:', f, filter);
    //             if (f.length > 0) {
    //                 isExisted = true;
    //                 break;
    //             }
    //             // check range include range or cover partial range
    //             filter = {};
    //             filter.date = data.date;
    //             filter.course = data.course;
    //             filter.type = TimeSectionType.RANGE;
    //             filter.$or = [
    //                 { 
    //                     $and: [
    //                         { startTime: {$lte: data.startTime }},
    //                         { endTime: { $gt: data.startTime }}
    //                     ]
    //                 },
    //                 {
    //                     $and: [
    //                         { startTime: {$lt: data.endTime }},
    //                         { endTime: { $gte: data.endTime }}
    //                     ]
    //                 }
    //             ];
    //             f = await this.modelRS.find(filter);
    //             console.log('createReservation find4:', f, filter);
    //             if (f.length> 0) {
    //                 isExisted = true;
    //                 break;
    //             }                
    //         }
    //     }
    //     return isExisted;
    // }

    async modifyReservationStatus(id:string, stsObj:ReservationStatusRequestDto, user:Partial<IUser>) {
        return FuncWithTryCatchNew(this.revOp, 'modifyStatus', id, stsObj, user);
        // const comRes = new CommonResponseDto();
        // try {
        //     const dt = this.myDate.toDateTimeString().split(' ');
        //     const mfyHis:IReserveHistory = {
        //         date: dt[0],
        //         time: dt[1],
        //         id: user.id,
        //         name: user.username,
        //         action: stsObj.status,
        //         reason: stsObj.status,
        //     }
        //     const upd = await this.modelReserve.updateOne(
        //         {id}, 
        //         {status : stsObj.status, $push: { history: mfyHis}}
        //     );
        //     if (upd.modifiedCount === 0) {
        //         comRes.ErrorCode = ErrCode.RESERVATION_NOT_FOUND;
        //     } 
        // } catch (error) {
        //     console.log('modifyReservationStatus error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }

    async getParticipants(id:string):Promise<ParticipantsResponse> {
        return FuncWithTryCatchNew(this.revOp, 'getParticipants', id);
        // const comRes = new ParticipantsResponse()
        // try {
        //     const rsv = await this.modelReserve
        //         .findOne({id}, 'participants')
        //         .populate({
        //             path: 'participants',
        //             select: 'registrationDate status',
        //             populate: {
        //                 path: 'member',
        //                 select: 'id name phone membershipType',
        //             }
        //         }).exec();
        //     if (rsv) {
        //         comRes.data = rsv.participants.map((par) => {
        //             const member = par.member as Partial<IMember>;
        //             const tmp:ParticipantData = {
        //                 id: member.id,
        //                 name: member.name,
        //                 phone: member.phone,
        //                 membershipType: member.membershipType,
        //                 registrationDate: par.registrationDate,
        //                 status: par.status,
        //             };
        //             return tmp;
        //         })
        //     } else {
        //         comRes.ErrorCode = ErrCode.RESERVATION_NOT_FOUND;
        //     }
        // } catch (error) {
        //     console.log('getParticipants error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }
}