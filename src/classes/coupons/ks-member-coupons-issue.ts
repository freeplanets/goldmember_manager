import mongoose, { FilterQuery, Model, mongo } from 'mongoose';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { MemberDcoument } from '../../dto/schemas/member.schema';
import { ACouponCreate, ICouponCreate } from './coupons-class-if';
import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { MEMBER_GROUP } from '../../utils/enum';
import { IMember } from '../../dto/interface/member.if';

export class KsMemberCouponsIssue extends ACouponCreate {
    // private isKsMember = false;
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
        console.log('KsMemberCouponsIssue create!');
        let result=false;
        try {
            //const mbrs = await this.getWitchMember();
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
                console.log("issue coupons count:", ans.length)
                this.session.commitTransaction();
                result = true;
            }
        } catch (e) {
            console.log('create coupon:', e);
            this.session.abortTransaction()
        }
        return result;
    }
    private async getMember() {
        let filter:FilterQuery<KsMemberDocument> = {
            // no: { $regex: /^[12]\d{3}$/},
            $or: [
                { 
                     $and: [
                         { no: { $regex: /^1\d{3}$/ } },
                         { no: { $lt: '1827' }},
                     ]
                 },
                 {
                     $and: [
                         { no: { $regex: /^2\d{3}$/ }},
                         { no: { $lt: '2175'}},
                     ]
                 }
             ]
        }
        if (this.data.targetGroups[0] === MEMBER_GROUP.DEPENDENTS) {
            filter.no.$regex = /^[56]\d{3}$/;
        }
        if (this.data.birthMonth) {
            filter.birthMonth = this.data.birthMonth;
        }
        console.log("getMember ks filter:", filter, filter.$or);
        const ans = await this.ksM.find(filter, 'no appUser');
        return ans.map((ks) => {
            const tmp:Partial<IMember> = {
                id: ks.appUser,
                systemId: ks.no,
            }
            return tmp;
        });
    }
    // private async getMember(birthMonth:number|undefined = undefined) {
    //     let filter:FilterQuery<MemberDcoument> = {
    //         membershipType: this.data.issueTarget,
    //     };
    //     if (birthMonth) {
    //         filter.birthDate = birthMonth;
    //     }
    //     return this.mbrM.find(filter, 'id systemId');
    // }
}