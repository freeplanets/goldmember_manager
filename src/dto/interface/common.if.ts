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
    type?: string;
    targetGroups: MEMBER_GROUP[];
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