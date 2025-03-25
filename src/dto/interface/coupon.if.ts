import { ANNOUNCEMENT_GROUP, COUPON_ISSUANCE_METHOD, COUPON_STATUS } from "../../utils/enum";
import { IModifiedBy } from "./modifyed-by.if";

export interface ICouponBatch {
    id?: string;
    name?: string;
    description?: string;
    type?: string;
    mode?: string;
    frequency?: string;
    validityMonths?: number;
    couponsPerPerson?: number;
    issueMode?: COUPON_ISSUANCE_METHOD; // 0 手動, 1 自動
    issueTarger?: ANNOUNCEMENT_GROUP;    // 發行對項
    issueDate?: string;
    expiryDate?: string;
    status?: string;
    targetDescription?: string;
    authorizer: IModifiedBy;
    canceler:IModifiedBy;
}

export interface ICoupon {
    id?: string;
    type?: string;
    memberId?: string;
    issueDate?: string;
    expiryDate?: string;
    status?: COUPON_STATUS;
    usedDate?: string;
    description?: string;
    originalOwner: string;
    toPaperNo: string;
    collector: IModifiedBy;
}

export interface IBirthDayCoupon {}     // 生日券
export interface IShareholderCoupon {}  // 股東券
export interface IDirectorSupervisorCoupon{} // 董監券

// paper 6 位數序號