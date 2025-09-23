import { AnyObject, Model, UpdateQuery } from 'mongoose';
import { IbulkWriteItem, IReturnObj } from '../../dto/interface/common.if';
import { FairwayDocument } from '../../dto/schemas/fairway.schema';
import { IFairway } from '../../dto/interface/field-management.if';
import { IUser } from '../../dto/interface/user.if';
import { DateLocale } from '../common/date-locale';
import { FAIRWAY_PATH } from '../../utils/enum';

export interface IRangeFairway {
    [key:string]: Partial<IFairway>[];
}
export class FairwayOp {
    private myDate = new DateLocale();
    constructor(private readonly model:Model<FairwayDocument>){}
    async list() {
        const rtn:IReturnObj = {};
        const data:IRangeFairway = {};
        const ans = await this.model.find();
        ans.forEach((itm) => {
            if (!data[itm.path]) data[itm.path] = [];
            const tmp:Partial<IFairway> = {
                fairway: itm.fairway,
                blueTee: itm.blueTee,
                whiteTee: itm.whiteTee,
                redTee: itm.redTee,
                par: itm.par,
                hdp: itm.hdp,
            };
            data[itm.path].push(tmp);
        })
        rtn.data = data;
        return rtn;
    }
    async update(course:string, fairway:number, dta:Partial<IFairway>, user:Partial<IUser>) {
        const rtn:IReturnObj = {};
        const data:UpdateQuery<FairwayDocument> = dta;
        data.$push = { logs: `操作人員:${user.username} 時間:${this.myDate.toDateTimeString()}`}
        rtn.data =  await this.model.updateOne({path: course, fairway}, data, {upsert: true});
        return rtn;
    }
    async initData() {
        const dtas = defaultJsonData;
        const datas = [];
        const del = await this.model.db.dropCollection('fairways');
        Object.keys(dtas).forEach((path) => {
            const areas = dtas[path];
            areas.forEach((data:Partial<IFairway>) => {
                data.path = path as FAIRWAY_PATH;
                datas.push(data) 
            })
        });
        const rtn:IReturnObj = {};
        if (datas.length>0) {
            rtn.data = await this.model.insertMany(datas);
        }
        return rtn;
    }
}
const defaultJsonData = { 
    west: [
        { fairway: 1, blueTee: 545, whiteTee: 526, redTee: 490, par: 5, hdp: 8 },
        { fairway: 2, blueTee: 165, whiteTee: 150, redTee: 130, par: 3, hdp: 6 },
        { fairway: 3, blueTee: 403, whiteTee: 375, redTee: 328, par: 4, hdp: 4 },
        { fairway: 4, blueTee: 445, whiteTee: 415, redTee: 345, par: 4, hdp: 1 },
        { fairway: 5, blueTee: 415, whiteTee: 390, redTee: 364, par: 4, hdp: 2 },
        { fairway: 6, blueTee: 420, whiteTee: 406, redTee: 345, par: 4, hdp: 3 },
        { fairway: 7, blueTee: 380, whiteTee: 366, redTee: 325, par: 4, hdp: 5 },
        { fairway: 8, blueTee: 175, whiteTee: 166, redTee: 145, par: 3, hdp: 7 },
        { fairway: 9, blueTee: 560, whiteTee: 535, redTee: 470, par: 5, hdp: 9 }
    ],
    south: [
        { fairway: 1, blueTee: 515, whiteTee: 506, redTee: 473, par: 5, hdp: 8 },
        { fairway: 2, blueTee: 400, whiteTee: 387, redTee: 328, par: 4, hdp: 2 },
        { fairway: 3, blueTee: 381, whiteTee: 366, redTee: 312, par: 4, hdp: 6 },
        { fairway: 4, blueTee: 535, whiteTee: 526, redTee: 455, par: 5, hdp: 5 },
        { fairway: 5, blueTee: 200, whiteTee: 166, redTee: 130, par: 3, hdp: 7 },
        { fairway: 6, blueTee: 424, whiteTee: 395, redTee: 345, par: 4, hdp: 4 },
        { fairway: 7, blueTee: 431, whiteTee: 410, redTee: 360, par: 4, hdp: 3 },
        { fairway: 8, blueTee: 165, whiteTee: 147, redTee: 130, par: 3, hdp: 9 },
        { fairway: 9, blueTee: 449, whiteTee: 416, redTee: 364, par: 4, hdp: 1 }
    ],
    east: [
        { fairway: 1, blueTee: 150, whiteTee: 146, redTee: 122, par: 3, hdp: 8 },
        { fairway: 2, blueTee: 400, whiteTee: 386, redTee: 360, par: 4, hdp: 3 },
        { fairway: 3, blueTee: 530, whiteTee: 526, redTee: 485, par: 5, hdp: 7 },
        { fairway: 4, blueTee: 400, whiteTee: 385, redTee: 328, par: 4, hdp: 1 },
        { fairway: 5, blueTee: 395, whiteTee: 383, redTee: 310, par: 4, hdp: 5 },
        { fairway: 6, blueTee: 192, whiteTee: 170, redTee: 150, par: 3, hdp: 6 },
        { fairway: 7, blueTee: 388, whiteTee: 380, redTee: 332, par: 4, hdp: 2 },
        { fairway: 8, blueTee: 395, whiteTee: 383, redTee: 332, par: 4, hdp: 4 },
        { fairway: 9, blueTee: 560, whiteTee: 546, redTee: 500, par: 5, hdp: 9 }
    ] 
};