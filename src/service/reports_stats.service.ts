import { Injectable } from '@nestjs/common';
import { COUPON_STATUS, MEMBER_LEVEL } from '../utils/enum';
import { InjectModel } from '@nestjs/mongoose';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { Model } from 'mongoose';
import { MemberGrowth, MemberGrowthDocument } from '../dto/schemas/member-growth.schema';
import { Coupon, CouponDocument } from '../dto/schemas/coupon.schema';
import { MemberYearly, MemberYearlyDocument } from '../dto/schemas/member-yearly.schema';
import { MemberMonthly, MemberMonthlyDocument } from '../dto/schemas/member-monthly.schema';
import { CouponStats, CouponStatsDocument } from '../dto/schemas/coupon-stats.schema';
import { ReportStatsResponseDto } from '../dto/resprt-stats-response.dto';
import { ErrCode } from '../utils/enumError';
import { ICouponStats, IMemberGrowth, IMemberMonthly, IMemberYearly, IReport } from '../dto/interface/report.if';
import { MemberActivity, MemberActivityDocument } from '../dto/schemas/member-activity.schema';
import { DateLocale } from '../classes/common/date-locale';

@Injectable()
export class ReportsStatsService {
  private myDate = new DateLocale();
  constructor(
    @InjectModel(Member.name) private readonly modelMember:Model<MemberDcoument>,
    @InjectModel(Coupon.name) private readonly modelCoupon:Model<CouponDocument>,
    @InjectModel(MemberYearly.name) private readonly modelMY:Model<MemberYearlyDocument>,
    @InjectModel(MemberMonthly.name) private readonly modelMM:Model<MemberMonthlyDocument>,
    @InjectModel(MemberGrowth.name) private readonly modelMG:Model<MemberGrowthDocument>,
    @InjectModel(CouponStats.name) private readonly modelCS:Model<CouponStatsDocument>,
    @InjectModel(MemberActivity.name) private readonly modelMA:Model<MemberActivityDocument>,
  ){}
  async reportsStats(syear: string): Promise<ReportStatsResponseDto> {
    const rsRes = new ReportStatsResponseDto();
    const result:IReport = {
      yearlyStats: {},
      monthlyStats: [],
      growthStats: [],
      couponStats: [],      
    }
    const year = Number(syear);
    try {
      await this.calMemberYearly(syear);
      // await this.calMemberMonthly(syear);
      // await this.calMemberGrowth(syear);
      result.yearlyStats = await this.getMemberYearly(year);
      result.monthlyStats = await this.getMemberMonthly(year);
      result.growthStats = await this.getMemberGrowth(year);
      result.couponStats = await this.getCouponStats(year);
      rsRes.data = result;
    } catch (e) {
      console.log('reportsStats Error:', e);
      rsRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      rsRes.error.extra = e;
    }
    return rsRes;
  }
  async recal(year:string){
    // await this.calCouponStats(year);
    // await this.modifyCouponStats();
    return this.reportsStats(year);
  }
  async getMemberYearly(year:number):Promise<Partial<IMemberYearly>> {
    const memberY:Partial<IMemberYearly> = {
      totalMembers: 0,
      newMembers: 0,
      totalCoupons: 0,
      usedCoupons: 0,
      usageRate:0,
    }
    try {
      const ans = await this.modelMY.findOne({year});
      console.log('getMemberYearly:' , ans);
      if (ans) {
        memberY.totalMembers = ans.totalMembers;
        memberY.totalCoupons = ans.totalCoupons;
        memberY.newMembers = ans.newMembers;
        memberY.usedCoupons = ans.usedCoupons;
        memberY.usageRate = ans.totalCoupons > 0 ? ans.usedCoupons / ans.totalCoupons : 0;
      }
    } catch(e) {
      console.log('getMemberYearly error:', e);
    }
    return memberY;
  }
  async getMemberMonthly(year:number):Promise<Partial<IMemberMonthly>[]> {
    const mm:Partial<IMemberMonthly> = {
      month: 0,
      newMembers: 0,
      usedCoupons: 0,
      yearToDateUsageRate: 0,
    }
    const mms:Partial<IMemberMonthly>[] = [];
    let totalCP = 0;
    try {
      // const ans = await this.modelMM.find({year});
      const ans = await this.modelMG.find({year});
      console.log('getMemberMonthly MG:', ans);
      if (ans) {
        ans.forEach((m) => {
          const tmp = {...mm};
          tmp.month = m.month;
          tmp.newMembers = m.regularGrowth + m.shareholderGrowth + m.familyGrowth;
          tmp.usedCoupons = 0;
          //totalCP += m.usedCoupons;
          mms.push(tmp);
        });
        const cpnUsed = await this.modelCS.aggregate([
            {$match: {year}},
            {$group: {
              _id: {
                month: '$month',
              },
              electronicUsed: {$sum: '$electronicUsed'}, 
              paperUnused: {$sum:'$paperUnused'}}
            },
        ], {_id: false, __v: false});
        console.log('getMemberMonthly CS:', cpnUsed);
        cpnUsed.forEach((c) => {
          const fIdx = mms.findIndex((m) => m.month === c._id.month);
          if (fIdx > -1) {
            mms[fIdx].usedCoupons = c.electronicUsed + c.paperUnused;
            totalCP += mms[fIdx].usedCoupons;
          }
        });
        mms.forEach((m) => {
          m.yearToDateUsageRate = totalCP > 0 ? m.usedCoupons / totalCP : 0;
        })
      }
    } catch(e) {
      console.log('getMemberMonthly error:', e);
    }
    return mms;
  }
  async getMemberGrowth(year:number):Promise<Partial<IMemberGrowth>[]> {
    const mg:Partial<IMemberGrowth> = {
      month: 0,
      regularGrowth: 0,
      shareholderGrowth: 0,
      familyGrowth: 0,
      regularActivity: 0,
      shareholderActivity: 0,
      familyActivity: 0,
    }
    const mgs:Partial<IMemberGrowth>[] = [];
    try {
      const ans = await this.modelMG.find({year});
      console.log('getMemberGrowth', ans);
      if (ans) {
        ans.forEach((m) => {
          const tmp = {...mg};
          tmp.month = m.month;
          tmp.regularGrowth = m.regularGrowth;
          tmp.familyGrowth = m.familyGrowth;
          tmp.shareholderGrowth = m.shareholderGrowth;
          tmp.regularActivity = m.regularActivity;
          tmp.shareholderActivity = m.shareholderActivity;
          tmp.familyActivity = m.familyActivity;
          mgs.push(tmp);
        })
      }
    } catch(e) {
      console.log('getMemberGrowth error:', e);
    }
    return mgs;
  }
  async getCouponStats(year:number) {
    const cpst:Partial<ICouponStats> = {
      type: '',
      electronicCount: 0,
      electronicUsed: 0,
      electronicInvalid: 0,
      electronicExpired: 0,
      electronicUnused: 0,
      paperCount: 0,
      paperUsed: 0,
      paperInvalid: 0,
      paperExpired: 0,
      paperUnused: 0,
    }
    const cpsts:Partial<ICouponStats>[] = [];
    try {
      const ans = await this.modelCS.aggregate([
        {$match: {year}},
        {$group: {
          _id: {
            type: '$type',
          },
          electronicCount: {$sum: '$electronicCount'},
          electronicUsed: {$sum: '$electronicUsed'},
          electronicInvalid: {$sum: '$electronicInvalid'},
          electronicExpired: {$sum: '$electronicExpired'},
          electronicUnused: {$sum: '$electronicUnused'},
          paperCount: {$sum: '$paperCount'},
          paperUsed: {$sum: '$paperUsed'},
          paperInvalid: {$sum: '$paperInvalid'},
          paperExpired: {$sum: '$paperExpired'},
          paperUnused: {$sum: '$paperUnused'}
        }},
      ]);
      console.log('getCounponStats', ans);
      if (ans) {
        ans.forEach((c) => {
          const tmp = {...cpst};
          tmp.type = c._id.type;
          tmp.electronicCount = c.electronicCount;
          tmp.electronicUsed = c.electronicUsed;
          tmp.electronicInvalid = c.electronicInvalid;
          tmp.electronicExpired = c.electronicExpired;
          tmp.electronicUnused = c.electronicUnused;
          tmp.paperCount = c.paperCount;
          tmp.paperUsed = c.paperUsed;
          tmp.paperInvalid = c.paperInvalid;
          tmp.paperExpired = c.paperExpired;
          tmp.paperUnused = c.paperUnused;
          cpsts.push(tmp);
        })
      }
    } catch(e) {
      console.log('getCouponStats error:', e);
    }
    return cpsts;
  }
  async calMemberYearly (year:string) {
    if (year && Number(year) < new Date().getFullYear()) return; 
    try {
      const mbrYr:Partial<IMemberYearly> = {}
      mbrYr.totalMembers = await this.modelMember.countDocuments();
      //const year = new Date().getFullYear();
      // /^((19|20)?[0-9]{2}[/](0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01]))$/
      // mbrYr.newMembers = (await this.modelMember.countDocuments({joinDate: {$regex: `^${year}/`}}));
      const mbrY = await this.modelMG.aggregate([
        { $match: {year: Number(year)}},
        { $group: {_id: null, regularGrowth: {$sum: '$regularGrowth'} }},
      ])
      console.log('calMemberYearly regularGrowth:', mbrY);
      mbrYr.newMembers = mbrY[0].regularGrowth;
      // const cpnUsed = await this.modelCoupon.countDocuments({usedDate: {$regex: `^${year}/`} ,status: COUPON_STATUS.USED});
      const cpnUsed = await this.modelCS.aggregate([
        {$match: {year: Number(year)}}, 
        {$group: {
          _id:null, 
          electronicUsed: {$sum: '$electronicUsed'}, 
          electronicUnused: {$sum: '$electronicUnused'}, 
          paperUsed: {$sum:'$paperUsed'},
          paperUnused: {$sum:'$paperUnused'}}},
      ]);
      // const cpnNotUsed = await this.modelCoupon.countDocuments({issueDate: {$regex: `^${year}/`} ,status: COUPON_STATUS.NOT_USED});
      console.log('calMemberYearly:', cpnUsed);
      mbrYr.usedCoupons = cpnUsed[0].electronicUsed + cpnUsed[0].paperUsed;
      mbrYr.totalCoupons = cpnUsed[0].electronicUnused + cpnUsed[0].paperUnused + mbrYr.usedCoupons; //cpnNotUsed + cpnUsed;
      ; //cpnUsed;
      // mbrYr.usageRate = mbrYr.usedCoupons / mbrYr.totalCoupons;
      const addR = await this.modelMY.updateOne({year:Number(year)}, mbrYr, {upsert: true});
      console.log(addR); 
    } catch(e) {
      console.log('calMemberYearly error:', e);
    }
  }
  async calMemberMonthly(year:string) {
    try {
      const mm:Partial<IMemberMonthly>={}
      const mms:Partial<IMemberMonthly>[] =[];
      const mon = new Date().getMonth() + 1;
      for (let i=1, n=mon+1; i<n; i++) {
        const tmp = {...mm};
        const mon = i < 10 ? `0${i}` : String(i);
        tmp.newMembers = await this.modelMember.countDocuments({ joinDate: {$regex: `^${year}/${mon}`}});
        tmp.usedCoupons = await this.modelCoupon.countDocuments({ usedDate:{$regex: `^${year}/${mon}`}});

        const upesert = await this.modelMM.updateOne({year:Number(year), month: i}, tmp, {upsert: true});
        console.log('calMemberMonthly:', upesert);
      }
      //const upesert = await this.modelMM.updateMany({year}, mms, {upsert: true});
      
    } catch(e) {
      console.log('calMemberMonthly error:', e);
    }
  }
  async calMemberGrowth(year:string) {
    try {
      const mg:Partial<IMemberGrowth> = {};
      const mon = new Date().getMonth() + 1;
      const nYear = Number(year);
      // const mTime = new Date(nYear, mon, 1).getTime();
      for (let i=1, n=mon+1;i<n;i++) {
        const tmp = {...mg};
        // const smon = i < 10 ? `0${i}` : String(i);
        // tmp.regularGrowth = await this.modelMember.countDocuments({
        //   joinDate: {$regex: `^${year}/${smon}`},
        //   membershipType: MEMBER_LEVEL.GENERAL_MEMBER,
        // });
        // tmp.shareholderGrowth = await this.modelMember.countDocuments({
        //   membershipLastModified: { modifiedAt: { $gt: mTime} },
        //   // joinDate: {$regex: `^${year}/${mon}`},
        //   membershipType: MEMBER_LEVEL.SHARE_HOLDER,
        // }); 
        // tmp.familyGrowth = await this.modelMember.countDocuments({
        //   membershipLastModified: { modifiedAt: { $gt: mTime} },
        //   // joinDate: {$regex: `^${year}/${mon}`},
        //   membershipType: MEMBER_LEVEL.DEPENDENTS,
        // });
        // member active 一個月內有登入
        // const activeLast = Date.now() - 30*24*60*60*1000;
        
        tmp.regularActivity = await this.modelMA.countDocuments({
          year: nYear,
          month: i,
          membershipType: MEMBER_LEVEL.GENERAL_MEMBER,
        }); 
        tmp.shareholderActivity = await this.modelMA.countDocuments({
          year:nYear,
          month: i,
          membershipType: MEMBER_LEVEL.SHARE_HOLDER,
        });
        tmp.familyActivity = await this.modelMA.countDocuments({
          year:nYear,
          month:i,
          membershipType: MEMBER_LEVEL.DEPENDENTS,
        }); 
        const upsert = await this.modelMG.updateOne({year:nYear, month: i }, tmp, {upsert: true});
        console.log('calMemberGrowth:', upsert);
      }
    } catch(e) {
      console.log('calMemberGrowth error:', e);
    }
  }
  async modifyCouponStats() {
    const month = new Date().getMonth() + 1;
    try {
      const rlts = await this.modelCS.find({},'year month type');
      rlts.forEach(async (r) => {
        console.log('modifyCouponStats:', r);
        if (!r.month) {
          await this.modelCS.updateOne({_id: r._id}, {month})
        }
      });
    } catch(e) {
      console.log('modifyCouponStats error:', e);
    }

  }
  async calCouponStats(year:string) {
    try {
      const cs:Partial<ICouponStats> = {};
      const types = [];
      for(let i=0, n = types.length; i < n ; i++) {
        const cpCnt = await this.modelCoupon.countDocuments({type: types[i]});
        if (cpCnt > 0) {
          const updM = await this.modelCoupon.updateMany({
            type: types[i], 
            $and: [
              { expiryDate: {$exists: true}},
              { expiryDate: {$lt: this.myDate.toDateString()}},
            ]
          }, {
            status: COUPON_STATUS.EXPIRED
          });
          console.log('calCouponStats expired update:', updM);
          const tmp = {...cs};
          // electronic
          tmp.electronicCount = await this.modelCoupon.countDocuments({
            type: types[i],
            toPaperNo: { $exists: false},
          });
          tmp.electronicUsed = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: false}, 
            status: COUPON_STATUS.USED,
          });
          tmp.electronicInvalid = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: false}, 
            status: COUPON_STATUS.CANCELED,
          });
          tmp.electronicExpired = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: false}, 
            expiryDate: COUPON_STATUS.EXPIRED,
          });
          tmp.electronicUnused = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: false}, 
            status: COUPON_STATUS.USED,
          });
          // paper
          tmp.paperCount = await this.modelCoupon.countDocuments({
            type: types[i],
            toPaperNo: { $exists: true},
          });
          tmp.paperUsed = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: true}, 
            status: COUPON_STATUS.USED,
          });
          tmp.paperInvalid = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: true}, 
            status: COUPON_STATUS.CANCELED,
          });
          tmp.paperExpired = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: true}, 
            expiryDate: COUPON_STATUS.EXPIRED,
          });
          tmp.paperUnused = await this.modelCoupon.countDocuments({
            type: types[i], 
            toPaperNo: { $exists: true}, 
            status: COUPON_STATUS.USED,
          });
          const upsert = await this.modelCS.updateOne({year:Number(year), type: types[i]}, tmp, {upsert: true});
          console.log(upsert);
        }
      }
    } catch (e) {
      console.log('calCouponStats error:', e);
    }
  }
}
