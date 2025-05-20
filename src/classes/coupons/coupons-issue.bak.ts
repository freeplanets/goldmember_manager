import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { ACouponCreate } from './coupons-class-if';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { MemberDcoument } from '../../dto/schemas/member.schema';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { IMember } from '../../dto/interface/member.if';

class CouponsIssue extends ACouponCreate {
    constructor(
        data: Partial<ICouponBatch>,
        ksM:Model<KsMemberDocument>,
        mbrM:Model<MemberDcoument>,
        cpM:Model<CouponDocument>,
        session:mongoose.mongo.ClientSession,
    ) {
        super(data, ksM, mbrM, cpM, session);
    }
    async create(): Promise<boolean> {
        console.log('CouponsIssue create!');
        let result=false;
        try {
            const mbrs = await this.getMember();
            console.log('ksmbr:', mbrs.length);
            const coupons:Partial<ICoupon>[]=[];
            if (mbrs.length > 0) {
                mbrs.forEach((mbr:Partial<IMember>) => {
                    for (let i=0; i<this.data.couponsPerPerson; i++) {
                        coupons.push(this.createCoupon(mbr));
                    }
                });
                const ans = await this.cpM.insertMany(coupons);
                console.log('issue coupons', ans)
                this.session.commitTransaction();
                result = true;
            }
        } catch (e) {
            console.log('create coupon:', e);
            this.session.abortTransaction()
        }
        return result;
    }
    async getMember() {
        let filter:FilterQuery<MemberDcoument> = {
            membershipType: this.data.targetGroups,
        };
        if (this.Data.birthMonth) {
            filter.birthDate = this.data.birthMonth;
        }
        return this.mbrM.find(filter, 'id systemId');
    }
}