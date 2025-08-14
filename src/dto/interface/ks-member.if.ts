export interface IKsMember {
    no:string;
    name:string;
    gender:number;
    birthday:string;
    birthMonth: number;
    types:number;
    ownId:string;
    realUser:string;
    isChanged:boolean;
    appUser:string;
}

export interface IInvitationCode {
    no:string;
    name:string;
    code:string;
    isCodeUsed: boolean;
    CodeUsedTS: number;
    isTransferred: boolean; // IF true, code wil expired
}