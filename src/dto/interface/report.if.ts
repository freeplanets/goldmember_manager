import { COUPON_TYPES } from "../../utils/enum";

export interface IMemberYearly {
    totalMembers?: number;
    newMembers?: number;
    totalCoupons?: number;
    usedCoupons?: number;
    usageRate?: number;
}

export interface IMemberMonthly {
    month?: number;
    newMembers?: number;
    usedCoupons?: number;
    yearToDateUsageRate?: number;
}

export interface IMemberGrowth {
    month?: number;
    regularGrowth?: number;
    shareholderGrowth?: number;
    familyGrowth?: number;
    regularActivity?: number;
    shareholderActivity?: number;
    familyActivity?: number;
}

export interface ICouponStats {
    type?: COUPON_TYPES;
    electronicCount?: number;
    electronicUsed?: number;
    electronicInvalid?: number;
    electronicExpired?: number;
    electronicUnused?: number;
    paperCount?: number;
    paperUsed?: number;
    paperInvalid?: number;
    paperExpired?: number;
    paperUnused?: number;
}

export interface IReport {
    yearlyStats: IMemberYearly;
    monthlyStats: IMemberMonthly[];
    growthStats: IMemberGrowth[];
    couponStats: ICouponStats[];
}