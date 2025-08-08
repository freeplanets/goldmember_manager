import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { EventNews, EventNewsDocument } from '../dto/schemas/event-news.schema';
import { BaseOp } from '../classes/eventnews/event-news-op';
import { IEventNews } from '../dto/interface/event-news';
import { FuncWithTryCatch } from '../classes/common/func.def';
import { IUser } from '../dto/interface/user.if';
import { EventNewsQueryRequest } from '../dto/eventnews/event-news-query-request.dto';
import { DateLocale } from '../classes/common/date-locale';

@Injectable()
export class EventNewsService {
    private dbOP:BaseOp<EventNewsDocument>;
    private myDate = new DateLocale();
    constructor(@InjectModel(EventNews.name) private readonly modelEN:Model<EventNewsDocument>){
        this.dbOP = new BaseOp(modelEN);
    }

    async add(eventNews:Partial<IEventNews>, user:Partial<IUser>) {
        eventNews.creator = {
            modifiedByWho: user.username,
            modifiedAt: Date.now(),
            modifiedBy: user.id,
        }
        // const comRes = new EventNewsRes();
        return FuncWithTryCatch(this.dbOP.add, eventNews);
        // try {
        //     comRes.data = await this.dbOP.add(eventNews);
        // } catch(error) {
        //     console.log('EventNewsService add error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;
        // }
        // return comRes;
    }

    async modify(id:string, mdfObj:Partial<IEventNews>, user:Partial<IUser>) {
        // const comRes = new CommonResponseDto();
        mdfObj.updater = {
            modifiedByWho: user.username,
            modifiedAt: Date.now(),
            modifiedBy: user.id,
        }
        return FuncWithTryCatch(this.dbOP.modify, id, mdfObj)
        // try {
        //     await this.dbOP.modify(id, mdfObj);
        // } catch (error) {
        //     console.log('EventNewsService modify error:', error);
        //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        //     comRes.error.extra = error.message;            
        // }
        // return comRes;
    }

    async list(query:EventNewsQueryRequest) {
        const filter:FilterQuery<EventNewsDocument> = {
            isDeleted: false,
        } 
        if (query.dateEnd && query.dateEnd) {
            filter.$and = [
                {dateStart: { $gte: query.dateStart}},
                {dateEnd: { $lte: query.dateEnd }},
            ]
        } else if (query.dateStart) {
            filter.dateStart = query.dateStart;
        } else if (query.dateEnd) {
            filter.dateEnd = query.dateEnd;
        } else {
            filter.dateStart = { $gte: this.myDate.toDateString() };
        }
        console.log('filter:', filter);
        return FuncWithTryCatch(this.dbOP.list, filter);
    }

    async findOne(id: string) {
        return FuncWithTryCatch(this.dbOP.findOne, id);
    }

    async deleteOne(id: string, user:Partial<IUser>) {
        const mdfObj:Partial<IEventNews> = {
            isDeleted: true,
            deleter: {
                modifiedByWho: user.username,
                modifiedAt: Date.now(),
                modifiedBy: user.id,
            }
        }
        return FuncWithTryCatch(this.dbOP.modify, id, mdfObj);
    }
}