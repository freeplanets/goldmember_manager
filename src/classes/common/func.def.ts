import { CommonResponseDto } from '../../dto/common/common-response.dto';
import { ICommonResponse } from '../../dto/interface/common.if';
import { ErrCode } from '../../utils/enumError';

export type asyncfunc = (...arp:any) => Promise<any>;
export type tryfunc<T> = (f: asyncfunc, ...arp:any[]) => Promise<any>;

export const FuncWithTryCatch: tryfunc<any> = async (f: asyncfunc, ...arp:any) => {
    const comRes:ICommonResponse<any> = new CommonResponseDto()
    try {
       comRes.data = await f(arp);
    } catch (error) {
        console.log('Error:', error);
        comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
        comRes.error.extra = error.message;
    }
    return comRes;
}