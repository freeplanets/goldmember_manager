import { FilterQuery, Model } from 'mongoose';
import { IReturnObj } from '../../dto/interface/common.if';
import { IGreenSpeeds } from '../../dto/interface/field-management.if';
import { GreenSpeedsDocument } from '../../dto/schemas/green-speeds.schema';
import { v1 as uuidv1 } from 'uuid';
import { DateLocale } from '../common/date-locale';

export class GreenSpeedsOp {
    private myDate = new DateLocale();
    constructor(private readonly model:Model<GreenSpeedsDocument>){}
    async list(startD:string, endD:string){
        if (!startD) startD = this.myDate.toDateString();
        if (!endD) endD = startD;
        const rtn:IReturnObj = {};
        const filter:FilterQuery<GreenSpeedsDocument> = {
            $and: [
                {date: { $gte: startD }},
                {date: { $lte: endD}},
            ]
        };
        rtn.data = await this.model.find(filter);
        return rtn;
    }

    async add(data:Partial<IGreenSpeeds>) {
        const rtn:IReturnObj = {};
        data.id = uuidv1();
        rtn.data = await this.model.create(data);
        return rtn;
    }
    async update(id:string, data:Partial<IGreenSpeeds>) {
        const rtn:IReturnObj = {}
        const upd = await this.model.updateOne({id}, data);
        if (upd.acknowledged) {
            rtn.data = id;
        }
        return rtn;
    }
}