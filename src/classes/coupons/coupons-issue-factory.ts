import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { ICouponBatch } from '../../dto/interface/coupon.if';
import mongoose, { Model } from 'mongoose';
import { MemberDcoument } from '../../dto/schemas/member.schema';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { COUPON_BATCH_ISSUANCE_METHOD, MEMBER_GROUP } from '../../utils/enum';
import { ACouponCreate } from './coupons-class-if';
import { KsMemberCouponsIssue } from './ks-member-coupons-issue';
import { CouponsIssue } from './coupons-issue';

export class CouponsIssueFactory {
    private Issuer:ACouponCreate;
    constructor(
        private readonly data: Partial<ICouponBatch>,
        private readonly ksM:Model<KsMemberDocument>,
        private readonly mbrM:Model<MemberDcoument>,
        private readonly cpM:Model<CouponDocument>,
        private readonly session:mongoose.mongo.ClientSession,
    ) {
        console.log('target:', data.targetGroups);
        switch(data.targetGroups[0]) {
            case MEMBER_GROUP.DEPENDENTS:
            case MEMBER_GROUP.SHARE_HOLDER:
                this.Issuer =  new KsMemberCouponsIssue(this.data, this.ksM, this.mbrM, this.cpM, this.session);
                break;
            default:
                // this.Issuer = new CouponsIssue(this.data, this.ksM, this.mbrM, this.cpM, this.session); 
                break;
        }
        // this.create();
    }
    async create():Promise<boolean>{
        if (this.Issuer) return this.Issuer.create();
        else {
            console.log('Issuer not defined')
        }
        return false;
    }
}