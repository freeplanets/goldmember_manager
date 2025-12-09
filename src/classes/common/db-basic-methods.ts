import { Document, UpdateWriteOpResult } from 'mongoose';
import { ICommonLog, ICommonResponse } from '../../dto/interface/common.if';
import { asyncfunc } from './func.def';
import { DateLocale } from './date-locale';
import { IUser } from '../../dto/interface/user.if';
import { IMember } from '../../dto/interface/member.if';
import lang from '../../utils/lang';

export abstract class ADbBasicMethods {
    //abstract add(comRes:ICommonResponse<T>, obj:T):Promise<T>;
    private myDate = new DateLocale();
    abstract add:asyncfunc;
    abstract modify:asyncfunc;  //(id:string, obj:Partial<T>):Promise<UpdateWriteOpResult>;
    abstract list:asyncfunc;    //(filter:any):Promise<T[]>;
    abstract findOne:asyncfunc; //(id:string):Promise<T>;
    abstract delete:asyncfunc;
    protected createLog(method:string, user:Partial<IUser | IMember| any>) {
        const who = user.username ? user.username : user.name;
        const log:ICommonLog = {
            description: `${lang.zhTW.common[`${method}`]}: ${who}`,
            transferDate: this.myDate.toDateTimeString(),
            transferDateTS: Date.now(),
        }
        return log;
    }
}