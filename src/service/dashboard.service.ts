import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from 'src/dto/schemas/announcement.schema';
import { CouponBatch, CouponBatchDocument } from 'src/dto/schemas/coupon-batch.schema';
import { Reservations, ReservationsDocument } from 'src/dto/schemas/reservations.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Reservations.name) private readonly modelRvn:Model<ReservationsDocument>,
        @InjectModel(Announcement.name) private readonly modelAnn:Model<AnnouncementDocument>,
        @InjectModel(CouponBatch.name) private readonly modelCB:Model<CouponBatchDocument>,
    ){}
    async getPending(){
        await this.modelAnn.find({}, '')
    }
}