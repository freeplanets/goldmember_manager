import { MEMBER_EXTEND_GROUP, MEMBER_GROUP } from '../../utils/enum';
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

export interface IbulkWriteItem<D, U> {
    insertOne?: {
        document:D
    },
    updateOne?: {
        filter: any;    // key of document like { key: "yourvalue" }
        update: U;
    }
}