import { LEVEL } from "../../utils/enum";

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
    lastLogin: string;
    lastLoginIp: string;
    need2changePass:boolean;
    has2Fa: boolean;
    SecretCode:string;
    _id?:string;
    __v?:number;
}

// 修改密碼，資料，二階段