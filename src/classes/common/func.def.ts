import { AnyObject } from 'mongoose';
import { CommonResponseDto } from '../../dto/common/common-response.dto';
import { ICommonResponse, IReturnObj } from '../../dto/interface/common.if';
import { ErrCode } from '../../utils/enumError';

export type asyncfunc = (...arp:any) => Promise<any>;
export type tryfunc<T> = (f: asyncfunc, ...arp:any[]) => Promise<any>;

export type asyncfuncReturnObj = (...arp:any) => Promise<IReturnObj>;
export type funcReturnObj<T> = (obj: AnyObject, fn:string, ...arp:any[]) => Promise<any>;

export const FuncWithTryCatch: tryfunc<any> = async (f: asyncfunc, ...arp:any) => {
    const comRes:ICommonResponse<any> = new CommonResponseDto()
    try {
        const ans  = await f(arp);
        // if (ans.id) 
        comRes.data = ans;
    } catch (error) {
        console.log('Error:', error);
        comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        comRes.error.extra = error.message;
    }
    return comRes;
}

export const FuncWithTryCatchNew: funcReturnObj<any> = async (obj: any, functionName:string, ...arp:any) => {
    const comRes:ICommonResponse<any> = new CommonResponseDto()
    try {
        const { data, error, extra }  = await obj[functionName](...arp);
        console.log('data:', data, 'error:', error);
        if (error) {
            comRes.ErrorCode = error;
                        if (extra) {
                comRes.error.extra = extra;
            }
        } else {
            // if (data.id) 
            comRes.data = data;
        }
    } catch (error) {
        console.log('Error:', error);
        comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        comRes.error.extra = error.message;
    }
    return comRes;
}