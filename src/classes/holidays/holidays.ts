import { HolidayDocument } from '../../dto/schemas/holiday.schema';
import { IHoliday, IReturnObj } from '../../dto/interface/common.if';
import { BaseOp } from '../eventnews/event-news-op';
import { FilterQuery, Model } from 'mongoose';
import { DateLocale } from '../common/date-locale';

export class Holidays {
    //private db:BaseOp<IHoliday>
    private myDate = new DateLocale();
    constructor(private readonly model:Model<HolidayDocument>) {
        //this.db = new BaseOp(model);
    }
    async list(year:number, month:number=0) {
        const rtnObj:IReturnObj = {};
        console.log('list:', year, month);
        const filter:FilterQuery<HolidayDocument> = {
            name: { $ne: '軍人節' },
        };
        if (!month) {
            filter.year = year;
        } else {
            const startD = this.myDate.toDateString(`${year}/${month}/01`);
            const endD = this.myDate.toDateString(`${year}/${month}/31`);
            filter.$and = [
                { date: { $gte: startD }},
                { date: { $lte: endD}},
            ]
        }
        console.log(filter, filter.$and);
        rtnObj.data = await this.model.find(filter, 'date name holidayCategory description');
        //return this.db.list([filter]);
        return rtnObj;
    }
}