import { ReservationsDocument } from '../../dto/schemas/reservations.schema';
import { IReservations, IReserveHistory, IReserveSection } from '../../dto/interface/reservations.if';
import { IMember } from '../../dto/interface/member.if';
import { ReserveSectionDocument } from '../../dto/schemas/reserve-section.schema';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { ActionOp, ReserveFrom, ReserveStatus, ReserveType, TimeSectionType } from '../../utils/enum';
import { v1 as uuidv1 } from 'uuid';
import { DateLocale } from '../common/date-locale';
import { IReturnObj } from '../../dto/interface/common.if';
import { ErrCode } from '../../utils/enumError';
import { IUser } from '../../dto/interface/user.if';
//import { ReservationsQueryRequestDto } from '../../dto/bookings/reservations-query-request.dto';
import { DateRangeQueryReqDto } from '../../dto/common/date-range-query-request.dto';
import { ReservationsQueryRequestDto } from '../../dto/reservations/reservations-query-request.dto';
import { ReservationStatusRequestDto } from '../../dto/reservations/reservation-status.request.dto';
import { ParticipantData } from '../../dto/reservations/participant.data';

export class ReserveOp {
    private myDate:DateLocale = new DateLocale();
    constructor(
        private readonly modelReserve:Model<ReservationsDocument>,
        private readonly modelRS:Model<ReserveSectionDocument>,
        private readonly connection:mongoose.Connection,
    ) {}
    async getById(id:string):Promise<IReturnObj> {
        const returnObj:IReturnObj = {};
        returnObj.data = await this.modelReserve.findOne({id}).populate({
            path: 'data',
            select: 'date timeSlot startTime endTime course courses type',
        });
        return returnObj;
    } 
    async get(rqr:ReservationsQueryRequestDto, user:Partial<IMember>|undefined):Promise<IReturnObj> {
        const returnObj:IReturnObj = {
            data: [],
        };
        const matches: FilterQuery<ReserveSectionDocument> = {
            status: { $ne: ReserveStatus.CANCELLED },
        };
        if (rqr.startDate || rqr.endDate) {
            if (!rqr.startDate) rqr.startDate = rqr.endDate;
            if (!rqr.endDate) rqr.endDate = rqr.startDate;
            matches.$and = [
            { date: {$gte: rqr.startDate } },
            { date: {$lte: rqr.endDate} },
            ];
        }
        if (user) {
            matches.refId = user.id;
        }
        console.log('matches', matches);
        const lst = await this.modelRS.find(matches, 'reservationId');
        const ids = lst.map((itm) => itm.reservationId);
        if (ids.length > 0) {
            const filter:FilterQuery<ReservationsDocument> = {
                id: { $in: ids },
            };
            if (rqr.type && rqr.type !== ReserveType.ALL) {
                filter.type = rqr.type;
            }
            if (rqr.status && rqr.status !== ReserveStatus.ALL) {
                filter.status = rqr.status;
            }
            console.log('filter:', filter)
            const rlt =  await this.modelReserve.find(filter).populate({
                path: 'data',
                select: 'date timeSlot startTime endTime course courses type',
            });
            console.log('rlt:', rlt);
            if (rlt) {
                returnObj.data = rlt;
            }
        }
        return returnObj;
    }
    async list(date:string|DateRangeQueryReqDto):Promise<IReturnObj> {
        const returnObj:IReturnObj = {};
        const filter:FilterQuery<ReserveSectionDocument> = {}
        if (typeof date === 'string') {
            filter.date =  date;
        } else {
            if (!date.startDate) date.startDate = this.myDate.toDateString();
            if (!date.endDate) date.endDate = date.startDate;
            filter.$and = [
                { date: { $gte: date.startDate}},
                { date: {$lte: date.endDate}},
            ]
        }
        filter.status = { $ne: ReserveStatus.CANCELLED };
        console.log('list filter:', filter);
        returnObj.data = await this.modelRS.find(filter, 'date timeSlot startTime endTime course courses type status');
        console.log('returnObj.data:', returnObj.data);
        return returnObj;
    }
    async create(createResv:Partial<IReservations>, user:Partial<IMember | IUser>):Promise<IReturnObj> {
    //async createReservation(params:any):Promise<IReturnObj> {
        // console.log('params:', params);
        // const [ a, b] = params;
        // let createResv:Partial<IReservations> = a;
        // let user:Partial<IMember | IUser> = b;
        const returnObj:IReturnObj = {};
        console.log('createResv:', createResv);
        const datas = createResv.data;
        console.log('createReservation', typeof datas, datas);
        const isExisted = await this.timeSectionCheck(datas);
        console.log('isExisted:',isExisted);
        if (!isExisted) {
            const session = await this.connection.startSession();
            session.startTransaction();
            createResv.id = uuidv1();
            datas.forEach((data) => {
                data.id = uuidv1();
                data.reservationId = createResv.id;
                data.refId = createResv.teamId ? createResv.teamId : createResv.memberId;
                data.status = ReserveStatus.PENDING;
            })
            const secDatas = await this.modelRS.insertMany(datas, {session});
            if (secDatas.length > 0) {
                createResv.data = secDatas.map((_id) => _id);
                // const his:Partial<IReserveHistory> = {};
                const opusr:any = user;
                if (opusr.username) {
                    //opUserName = opusr.username;
                    createResv.reservedFrom = ReserveFrom.BACKEND;
                } else {
                    //opUserName = opusr.name;
                    createResv.reservedFrom = ReserveFrom.APP;
                }
                //his.action = ReserveStatus.BOOKED
                const his = this.createHistory(user, ActionOp.CREATE);
                createResv.createdAt = his.transferDate;
                createResv.history = [his];
                createResv.status = ReserveStatus.PENDING;
                // createResv.status = ReserveStatus.BOOKED;
                const cr = await this.modelReserve.create([createResv], {session});
                console.log('createReservation:', cr);
                returnObj.data = cr;
                await session.commitTransaction();
            }
            await session.endSession();
        } else {
            returnObj.error = ErrCode.SELECTED_TIME_SECTION_ASSIGNED;
        }
        return returnObj;
    }
    async modify(id:string, mfyResv:Partial<IReservations>, user:any):Promise<IReturnObj> {
        const returnObj:IReturnObj = {}
        //const data:Partial<IReservations> = {};
        const foundRev = await this.modelReserve.findOne({id});
        if (!foundRev) {
            returnObj.error = ErrCode.RESERVATION_NOT_FOUND;
            return returnObj;
        }
        let isExisted = false;
        let modifyData = false; //有修改時段
        if (mfyResv.data) {
            modifyData = true;
            const datas = mfyResv.data;
            console.log('createReservation', typeof datas, datas);
            isExisted = await this.timeSectionCheck(datas, id);         
        }
        console.log('isExisted:', isExisted);
        if (!isExisted) {
            const session = await this.connection.startSession();
            session.startTransaction();
            if (modifyData) {
                const datas = mfyResv.data;
                console.log('datas:', datas);
                datas.forEach((itm:any) => {
                    if (itm._id) delete itm._id;
                    itm.id = uuidv1();
                    itm.reservationId = id;
                    itm.refId = foundRev.teamId ? foundRev.teamId : foundRev.memberId;
                });
                console.log('datas after forEach:', datas);
                const delRS = await this.modelRS.deleteMany({reservationId: id}, {session});
                console.log('delRes:', delRS);
                const secDatas = await this.modelRS.insertMany(datas, {session});
                console.log('secDatas:', secDatas);
                if (secDatas.length > 0) {
                    mfyResv.data = secDatas.map((itm) => itm._id);
                }
            }
            const modifyResv:UpdateQuery<ReservationsDocument> = mfyResv;
            const his = this.createHistory(user, ActionOp.MODIFY);
            console.log('modifyReservation his:', his);
            modifyResv.$push = { history: his };
            console.log('modifyReservation modifyResv:', modifyResv);
            const upd = await this.modelReserve.updateOne({id}, modifyResv);
            console.log('modifyReservation upd:', upd);
            await session.commitTransaction();
            await session.endSession();
            returnObj.data = upd;
        } else {
            returnObj.error = ErrCode.SELECTED_TIME_SECTION_ASSIGNED;
        }
        return returnObj;
    }
    async modifyStatus(id:string,resv:ReservationStatusRequestDto, user:Partial<IUser | IMember>) {
        const returnObj:IReturnObj = {}
        const filter:FilterQuery<ReservationsDocument>={
            id,
        };
        if (resv.teamId) filter.teamId = resv.teamId;
        if (resv.memberId) filter.memberId = resv.memberId
        // if (!teamId) {
        //     filter.memberId = user.id;
        // } else {
        //     filter.teamId = teamId;
        // }
        const found = await this.modelReserve.findOne(filter, 'id data status');
        if (found) {
            const tsids = found.data.map((v) => v);
            const session = await this.connection.startSession();
            session.startTransaction();
            const updrs = await this.modelRS.updateMany({_id: {$in: tsids}}, {status: resv.status}, {session});
            console.log('updrs:', updrs);
            if (updrs.acknowledged) {
                const act = resv.status === ReserveStatus.CANCELLED ? ActionOp.CANCELED : ActionOp.MODIFY;
                const his = this.createHistory(user, act);
                his.description = `${his.description} 狀態: ${found.status} -> ${resv.reason} 原由:${resv.reason}`;
                const upd = await this.modelReserve.updateOne(filter, {
                    status: resv.status,
                    $push: { history: his },
                });
                console.log('upd:', upd);
                if (upd.acknowledged) {
                    returnObj.data = id;
                    await session.commitTransaction();
                }
            }
            await session.endSession();
        } else {
            returnObj.error = ErrCode.RESERVATION_NOT_FOUND;
        }
        return returnObj;
    }
    async cancel(id:string, user:Partial<IUser | IMember>, teamId: string=''):Promise<IReturnObj>{
        const resv = new ReservationStatusRequestDto();
        resv.status = ReserveStatus.CANCELLED;
        if (teamId) resv.teamId = teamId;
        else {
            if ((user as IMember).name) {
                resv.memberId = user.id;
            }
        }
        return this.modifyStatus(id, resv, user);
    }
    async getParticipants(id:string):Promise<IReturnObj> {
        const returnObj:IReturnObj = {}
        const rsv = await this.modelReserve
            .findOne({id}, 'participants')
            .populate({
                path: 'participants',
                select: 'registrationDate status',
                populate: {
                    path: 'member',
                    select: 'id name phone membershipType',
                }
            }).exec();
        if (rsv) {
            returnObj.data = rsv.participants.map((par) => {
                const member = par.member as Partial<IMember>;
                const tmp:ParticipantData = {
                    id: member.id,
                    name: member.name,
                    phone: member.phone,
                    membershipType: member.membershipType,
                    registrationDate: par.registrationDate,
                    status: par.status,
                };
                return tmp;
            })
        } else {
            returnObj.error = ErrCode.RESERVATION_NOT_FOUND;
        }
        return returnObj;
    }     
    async timeSectionCheck(datas:Partial<IReserveSection>[], revId:string = '') {
        console.log('timeSectionCheck', typeof datas, datas);
        const dfF:FilterQuery<ReserveSectionDocument> = {};
        if (revId) dfF.reservationId = { $ne: revId };
        let filter:FilterQuery<ReserveSectionDocument>;
        let isExisted = false;
        for (let i=0, n=datas.length; i<n; i++) {
            const data = datas[i];
            if (data.type === TimeSectionType.TIMESLOT) {
                // check timeslot
                filter = {...dfF};
                filter.date = data.date;
                filter.timeSlot = data.timeSlot;
                filter.course = data.course;
                filter.type = TimeSectionType.TIMESLOT;
                let f = await this.modelRS.findOne(filter);
                console.log('createReservation find1:', f, filter);
                if (f) {
                    isExisted = true;
                    break;
                }
                // check timeslot in time range
                filter = {...dfF}
                filter.date = data.date;
                filter.type = TimeSectionType.RANGE;
                filter.course = data.course;
                filter.$and = [
                    //{$gte: [data.timeSlot, '$startTime']},
                    //{$lte: [data.timeSlot, '$endTime']},
                    {startTime: {$lte: data.timeSlot}},
                    {endTime: {$gte: data.timeSlot}},
                ]
                // console.log('createReservation find2:', f, filter);
                f = await this.modelRS.findOne(filter);
                console.log('createReservation find2:', f, filter);
                if (f) {
                    isExisted = true;
                    break;
                }
            } else {
                // check range include timeslot
                filter = {...dfF};
                filter.date = data.date;
                filter.course = data.course;
                filter.type = TimeSectionType.TIMESLOT;
                filter.$and = [
                    //{ $gte: [ '$timeSlot', data.startTime ]},
                    //{ $lte: [ '$timeSlot', data.endTime ]},
                    { timeSlot: {$gte: data.startTime}},
                    { timeSlot: {$lte: data.endTime}},
                ]
                let f = await this.modelRS.find(filter);
                console.log('createReservation find3:', f, filter);
                if (f.length > 0) {
                    isExisted = true;
                    break;
                }
                // check range include range or cover partial range
                filter = {...dfF};
                filter.date = data.date;
                filter.course = data.course;
                filter.type = TimeSectionType.RANGE;
                filter.$or = [
                    { 
                        $and: [
                            { startTime: {$lte: data.startTime }},
                            { endTime: { $gt: data.startTime }}
                        ]
                    },
                    {
                        $and: [
                            { startTime: {$lt: data.endTime }},
                            { endTime: { $gte: data.endTime }}
                        ]
                    }
                ];
                f = await this.modelRS.find(filter);
                console.log('createReservation find4:', f, filter);
                if (f.length> 0) {
                    isExisted = true;
                    break;
                }                
            }
        }
        return isExisted;
    }
    createHistory(opusr:any, op:ActionOp) {
        const his:Partial<IReserveHistory> = {};
        //const opusr:any = user;
        let opUserName='';
        if (opusr.username) {
            opUserName = opusr.username;
        } else {
            opUserName = opusr.name;
        }
        //his.action = ReserveStatus.BOOKED
        his.id = opusr.id;
        his.name = opUserName;
        const dt = this.myDate.toDateTimeString();
        let msg = '';
        switch(op) {
            case ActionOp.CREATE:
                msg = '建立人';
                break;
            case ActionOp.MODIFY:
                msg = '修改人';
                break;
            case ActionOp.CANCELED:
                msg = '取消人'
                break;
        }
        his.description = `${msg}:${his.name}`;
        his.transferDate = dt;
        his.transferDateTS = Date.now();
        return his;  
    }
}