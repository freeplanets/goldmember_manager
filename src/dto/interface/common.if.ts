import { FilterQuery, UpdateQuery } from 'mongoose';
import { MEMBER_EXTEND_GROUP, ORGANIZATION_TYPE } from '../../utils/enum';
import { ErrCode } from '../../utils/enumError';

export interface ICommonResponse<T> {
    errorcode?: ErrCode;
    ErrorCode?: ErrCode;
    error?: ICommonError;
    data?: T;
}

export interface ICommonError {
    message?: string;
    extra?: any;
}

export interface ISmsVerify {
    secret: string;
    code: string;
}

export interface ITempData {
    code?:string;
    value?:string;
    codeUsage?:string;
    ts:number;
}

export interface IHasFilterItem {
    id?:string;
    type?: string;
    targetGroups: any[];
    extendFilter?: MEMBER_EXTEND_GROUP[];    
}

export interface IHoliday {
    year: number;
    date: string;
    name: string;
    isHoliday: boolean;
    holidayCategory: string;
    description: string;
}

export interface AnyObject {
    [key:string]:any;
}

export interface IHasId extends AnyObject {
    id?:string;
}

export interface IHasPhone extends AnyObject {
    phone:string;
}

export interface IbulkWriteItem<D> {
    insertOne?: {
        document:D
    },
    updateOne?: {
        filter: FilterQuery<D>;    // key of document like { key: "yourvalue" }
        update: UpdateQuery<D>;
    },
    updateMany?: {
        filter: FilterQuery<D>;    // key of document like { key: "yourvalue" }
        update: UpdateQuery<D>;
    },    
    deleteOne?: {
      filter: FilterQuery<D>;
    },
}

export interface ICommonLog {
    description:string;
    transferDate: string;
    transferDateTS: number;  
}

export interface IReturnObj {
    data?: any,
    error?: ErrCode,
    extra?: any;
}

export interface IOrganization {
    id:string;
    type: ORGANIZATION_TYPE;
    name: string;
}