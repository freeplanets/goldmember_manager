import { Document, UpdateWriteOpResult } from 'mongoose';
import { ICommonResponse } from '../../dto/interface/common.if';
import { asyncfunc } from './func.def';

export abstract class ADbBasicMethods {
    //abstract add(comRes:ICommonResponse<T>, obj:T):Promise<T>;
    abstract add:asyncfunc;
    abstract modify:asyncfunc;  //(id:string, obj:Partial<T>):Promise<UpdateWriteOpResult>;
    abstract list:asyncfunc;    //(filter:any):Promise<T[]>;
    abstract findOne:asyncfunc; //(id:string):Promise<T>;
}