import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement } from "../interface/announcement.if";
import { ICoupon } from "../interface/coupon.if";
import { IPendingITem } from "../interface/dashboard.if";
import { IReservations } from "../interface/reservations.if";

export class Pendings {
    @ApiProperty({
        description: '待處理事項',
    })
    items: IPendingITem[];
    reservations: IReservations[];
    announcements: Partial<IAnnouncement>[];
    coupons:Partial<ICoupon>[]
}