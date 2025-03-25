import { ErrCode, ErrMsg } from "../../utils/enumError";

export interface ICommonResponse<T> {
    errorcode: ErrCode;
    error?: ICommonError;
    data?: T;
}

export interface ICommonError {
    message: string;
    extra?: object;
}