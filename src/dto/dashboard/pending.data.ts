import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement } from "../interface/announcement.if";
import { ICoupon, ICouponBatch } from "../interface/coupon.if";
import { IPendingITem } from "../interface/dashboard.if";
import { IReservations } from "../interface/reservations.if";
import { PendingItemData } from "./pending-item.data";

export class Pendings {
    constructor() {
        this.items = [];
        // this.reservations = [];
        // this.announcements = [];
        // this.coupons = [];
    }
    @ApiProperty({
        description: '待處理事項',
        type: PendingItemData,
    })
    items: IPendingITem[];

    @ApiProperty({
        description: '預約',
    })
    reservations: IReservations[];

    @ApiProperty({
        description: '公告',
    })
    announcements: Partial<IAnnouncement>[];

    @ApiProperty({
        description: '優惠券',
    })
    coupons:Partial<ICouponBatch>[]
}