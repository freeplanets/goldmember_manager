import { BIRTH_OF_MONTH, COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, COUPON_STATUS } from '../../utils/enum';
import { IHasFilterItem } from './common.if';
import { IModifiedBy } from './modifyed-by.if';

export interface ICouponBatch extends IHasFilterItem {
    id?: string;
    name?: string;
    description?: string;
    birthMonth?: BIRTH_OF_MONTH,
    mode?: string;
    frequency?: string;
    validityMonths?: number;
    couponsPerPerson?: number;
    issueMode?: COUPON_BATCH_ISSUANCE_METHOD; // 手動,  自動
    issueDate?: string;
    expiryDate?: string;
    status?: COUPON_BATCH_STATUS;
    originId?: string;
    couponCreated?: boolean;
    creator: IModifiedBy;
    authorizer: IModifiedBy;
    updater: IModifiedBy;
}

export interface ICoupon {
    id?: string;
    batchId?: string;
    name:string;
    type?: string;
    mode?: string;
    memberId?: string;
    memberName?:string;
    issueDate?: string;
    expiryDate?: string;
    status?: COUPON_STATUS;
    usedDate?: string;
    description?: string;
    originalOwnerId?:string;
    originalOwner?: string;
    notAppMember?: boolean;
    toPaperNo: string;
    updater: IModifiedBy;
    collector: IModifiedBy;
}

export interface ICouponAutoIssuedLog {
    BatchId: string;
    name?: string;
    type?: string;
    issueDate?: string;
    originBatchId?: string;
    totalCoupons?: number;
    issueDateTs?: number;
}

export interface ICouponTransferLog {
    id:string;
    couponId:string;
    newOwner:string;
    newOwnerId:string;
    originalOwner:string;
    originalOwnerId:string;
    transferDate: string;
    transferDateTS: number;
}

export interface IBirthDayCoupon {}     // 生日券
export interface IShareholderCoupon {}  // 股東券
export interface IDirectorSupervisorCoupon{} // 董監券

// paper 6 位數序號

// coupon 被使用通知持有人