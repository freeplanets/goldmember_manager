import { LEVEL } from "../../utils/enum";
import { ILoginDevice } from "./devices.if";

export interface IUser {
    id: string;
    username: string;
    displayName: string;
    password: string;
    role: string;
    authRole: LEVEL;
    email: string;
    phone: string;
    isActive: boolean;
    isLocked?: boolean;
    passwordFailedCount?: number
    passwordLastTryTs?: number; 
    lastLogin: number;
    lastLoginIp: string;
    lastLoginDevice: Partial<ILoginDevice>;
    need2changePass:boolean;
    has2Fa: boolean;
    SecretCode:string;
    devices:Partial<ILoginDevice>[];
    _id?:string;
    __v?:number;
}

export interface IUserAccessLog {
    username: string;
    path: string;
    token: string;
    body: any;
    query: any;
    accessDate:string;
    accessTime:string;
    accessTimeTS: number;
}

// 修改密碼，資料，二階段