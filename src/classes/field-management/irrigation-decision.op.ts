import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { IReturnObj } from '../../dto/interface/common.if';
import { IIrrigationDecisions } from '../../dto/interface/field-management.if';
import { IrrigationDecisionsDocument } from '../../dto/schemas/irrigation-decisions.schema';
import { v1 as uuidv1 } from 'uuid';
import { IUser } from '../../dto/interface/user.if';
import { DateLocale } from '../common/date-locale';

export class IrrigationDecisionOp {
    private myDate = new DateLocale();
    constructor(private readonly model:Model<IrrigationDecisionsDocument>){}
    async list(dateS:string, dateE:string) {
        const rtn:IReturnObj = {};
        const filter:FilterQuery<IrrigationDecisionsDocument> = {
            $and: [
                {date: {$gte: dateS }},
                {date: {$lte: dateS }},
            ]
        }
        rtn.data = await this.model.find(filter);
        return rtn;
    }
    async add(data:Partial<IIrrigationDecisions>, user:Partial<IUser>) {
        const rtn:IReturnObj = {};
        data.id = uuidv1();
        data.recordedBy = user.username;
        data.recordedAt = this.myDate.toDateTimeString();
        data.recordedAtTS = Date.now();
        const log = `新增人員;${user.username}, 時間:${data.recordedAt}`;
        data.logs = [log];
        rtn.data = await this.model.create(data);
        return rtn;
    }
    async modify(id:string, dta:Partial<IIrrigationDecisions>, user:Partial<IUser>) {
        const rtn:IReturnObj = {};
        if (dta.id) delete dta.id;
        const data:UpdateQuery<IrrigationDecisionsDocument> = dta;
        data.recordedBy = user.username;
        data.recordedAt = this.myDate.toDateTimeString();
        data.recordedAtTS = Date.now();
        const log = `修改人員;${user.username}, 時間:${data.recordedAt}`; 
        data.$push = { logs: log };
        const upd = await this.model.updateOne({id}, data);
        if (upd.acknowledged) {
            rtn.data = id;
        }
        return rtn;
    }
}