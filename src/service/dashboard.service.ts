import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from '../dto/schemas/announcement.schema';
import { CouponBatch, CouponBatchDocument } from '../dto/schemas/coupon-batch.schema';
import { Reservations, ReservationsDocument } from '../dto/schemas/reservations.schema';
import { PendingAllResponse } from '../dto/dashboard/pending-all.response';
import { Pendings } from '../dto/dashboard/pending.data';
import { IPendingITem } from '../dto/interface/dashboard.if';
import { COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, PendingItemStatus, PendingItemType, ReserveStatus } from '../utils/enum';
import { ErrCode } from '../utils/enumError';
import { DateLocale } from '../classes/common/date-locale';

@Injectable()
export class DashboardService {
    private myDate = new DateLocale();
    constructor(
        @InjectModel(Reservations.name) private readonly modelRvn:Model<ReservationsDocument>,
        @InjectModel(Announcement.name) private readonly modelAnn:Model<AnnouncementDocument>,
        @InjectModel(CouponBatch.name) private readonly modelCB:Model<CouponBatchDocument>,
    ){}
    async getPending(){
        const comRes = new PendingAllResponse();
        const pendings = new Pendings();
        try {
            await this.getAnns(pendings);
            await this.getCoup(pendings);
            await this.getRever(pendings);
            comRes.data = pendings;
        } catch (err) {
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = err.message;
        }
        return comRes;
    }
    async getAnns(pendings:Pendings) {
        const anns = await this.modelAnn.find(
            {
                $and: [
                    {$and: [
                        {expiryDate: {$exists: true}},
                        {expiryDate: { $gte: this.myDate.toDateString() }},
                    ]},
                    {authorizer: {$exists: false}}
                ]

            }
            // {
            //     $or:[
            //         { isPublished: false },
            //         { isPublished: { $exists: false} },
            //     ]
            // },

        );
        anns.forEach((ann) => {
            const itm:IPendingITem = {
                id: ann.id,
                type: PendingItemType.ANNOUNCEMENT,
                title: ann.title,
                date: ann.publishDate,
                status: PendingItemStatus.PENDING,
            }
            pendings.items.push(itm);
        });
        pendings.announcements = anns;
    }
    async getCoup(pendings:Pendings) {
        const cbs = await this.modelCB.find({
            issueMode: COUPON_BATCH_ISSUANCE_METHOD.MANUAL,
            status: COUPON_BATCH_STATUS.NOT_ISSUED,
        });
        cbs.forEach((cb) => {
            const itm:IPendingITem = {
                id: cb.id,
                type: PendingItemType.COUPON,
                title: cb.name,
                date: cb.issueDate,
                status: cb.status,
            }
            pendings.items.push(itm);
        });
        pendings.coupons = cbs;
    }
    async getRever(pendings:Pendings) {
        const rvns = await this.modelRvn.find({ status: ReserveStatus.PENDING });
        rvns.forEach((rvn) => {
            const itm:IPendingITem = {
                id: rvn.id,
                type: PendingItemType.RESERVATION,
                title: rvn.teamName ? rvn.teamName : rvn.memberName,
                date: rvn.data ? rvn.data[0].date : '',
                status: rvn.status,
            };
            pendings.items.push(itm);
        })
        pendings.reservations = rvns;
    }
}