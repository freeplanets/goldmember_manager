import mongoose, { ClientSession, FilterQuery, InsertManyOptions, Model } from 'mongoose';
import { MainFilters } from '../../classes/filters/main-filters';
import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { MemberDcoument } from '../../dto/schemas/member.schema';
import { CouponsIssue } from '../../classes/coupons/coupons-issue';
import { COUPON_STATUS, MEMBER_GROUP } from '../enum';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { IMember } from '../../dto/interface/member.if';

export class CouponFunc {
    private myFilter = new MainFilters();
    async insertCoupons(
        couponBatchPostDto:Partial<ICouponBatch>, 
        modelMbr:Model<MemberDcoument>,
        modelCP:Model<CouponDocument>,
        modelKS:Model<KsMemberDocument>,
        // modelCS:Model<CouponStatsDocument>,
        coupon_status = COUPON_STATUS.NOT_ISSUED,
        session:ClientSession,
    ) {
        // const filter = this.myFilter.membersFilter(
        //     couponBatchPostDto.targetGroups,
        //     couponBatchPostDto.extendFilter,
        // );
        // const mbrs = await modelMbr.find(filter, 'id name');
        console.log('do insertCoupon');
        const mbrs = await this.getMember(couponBatchPostDto, modelMbr, modelKS);
        //console.log('mbrs:', mbrs);
        const ci = new CouponsIssue();
        const cpns = ci.create(mbrs, couponBatchPostDto, coupon_status);
        if (cpns) {
            console.log("cpns:", cpns.length);
            // await this.modifyCouponStats(couponBatchPostDto.type, couponBatchPostDto.issueDate, cpns.length, modelCS);
        }
        const ins = await modelCP.insertMany(cpns, {rawResult: true, session});
        console.log('insertCoupon:', ins.insertedCount);
        return ins;
    }    
    async getMember(
        couponBatchPostDto:Partial<ICouponBatch>, 
        modelMbr:Model<MemberDcoument>, 
        modelKs:Model<KsMemberDocument> 
    ) {
        console.log('do getMember')
        let ksMbrs: Partial<IMember>[];
        if (couponBatchPostDto.targetGroups[0] === MEMBER_GROUP.SHARE_HOLDER) {
            ksMbrs = await this.getKsMember(couponBatchPostDto.targetGroups[0], modelKs, couponBatchPostDto.birthMonth);
            if (ksMbrs) console.log('ksMbrs:', ksMbrs.length);
        }
        const filter = this.myFilter.membersFilter(
            couponBatchPostDto.targetGroups,
            couponBatchPostDto.extendFilter,
        );
        const mbrs:Partial<IMember>[] = await modelMbr.find(filter, 'id name systemId');
        const allMbrs = mbrs.map((mbr) => mbr);
        // const f = allMbrs.find((itm) => itm.systemId === '1079');
        // console.log('mbrs:', mbrs, f);
        if (ksMbrs) {
            ksMbrs.forEach( (ksM) => {
                console.log('ksmbr:', ksM.id, ksM.name, ksM.systemId);
                const fIdx = allMbrs.findIndex((mbr) => mbr.systemId === ksM.systemId);
                if (fIdx === -1) allMbrs.push(ksM);
                // if (ksM.systemId === '1079') {
                //     const f = allMbrs.find((itm) => itm.systemId === '1079');
                //     console.log(ksM, f);
                // }
            });
        }
        return allMbrs;
    }
    async getKsMember(target:MEMBER_GROUP, modelKs:Model<KsMemberDocument>, birthMonth:number|undefined = undefined) {
        console.log('do getKsMember:')
        let filter:FilterQuery<KsMemberDocument> = {}
        if (target === MEMBER_GROUP.SHARE_HOLDER) {
            filter = {$or: [
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
             ]};
        } else {
            filter.no = { $regex: /^[56]\d{3}$/};
        }
        if (birthMonth) {
            filter.birthMonth = birthMonth;
        }
        console.log("getMember ks filter:", filter, filter.$or);
        const ans = await modelKs.find(filter, 'no appUser name');
        return ans.map((ks) => {
            const tmp:Partial<IMember> = {
                id: ks.appUser ? ks.appUser : ks.no,
                systemId: ks.no,
                name: ks.name,
            }
            console.log('getKsMember:', tmp.id, tmp.name);
            return tmp;
        });
    }
}