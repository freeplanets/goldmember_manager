import { Coupon, CouponDocument, CouponSchema } from '../../dto/schemas/coupon.schema';
import { CouponBatch, CouponBatchDocument, CouponBatchSchema } from '../../dto/schemas/coupon-batch.schema';
import { getMongoDB } from '../database/mongodb';
import { COUPON_BATCH_STATUS, COUPON_STATUS } from '../enum';
import { FilterQuery } from 'mongoose';
import { CouponStats, CouponStatsSchema } from '../../dto/schemas/coupon-stats.schema';
import lang from '../lang';
import { DateLocale, TIME_SETTING } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export const couponsExpiredCheck = async () => {
    const d = new Date();
    try {
        console.log('couponsExpiredCheck UTC:', d.getTimezoneOffset(), d.toUTCString());
        console.log('couponsExpiredCheck:', myDate.toDateString());
        const db = await getMongoDB();
        const modelCB = db.model(CouponBatch.name, CouponBatchSchema);
        const modelCoupon = db.model(Coupon.name, CouponSchema );
        const modelCS = db.model(CouponStats.name, CouponStatsSchema);
        // const locale = 'zh-TW';
        //未發行，已過期處理
        let filter:FilterQuery<CouponBatchDocument> | FilterQuery<CouponDocument> = {
            $and: [
                { expiryDate: { $exists: true }},
                { expiryDate: { $lt: myDate.toDateString() }},
            ],
            status: COUPON_BATCH_STATUS.NOT_ISSUED,
        }
        const expiredCB = await modelCB.find(filter, 'id');
        let ids:string[]=[];
        console.log('expiredCB', expiredCB);
        const session = await db.startSession();
        session.startTransaction();
        let isProcPass = true;
        if (expiredCB.length > 0) {
            const updater = {
                modifiedByWho: 'system',
                modifiedAt: d.getTime(),
                lastValue: "$status",
            }
            ids = expiredCB.map((cb) => cb.id);
            const upd = await modelCB.updateMany( 
                { id: { $in: ids }},
                [{
                    $set: { 
                        status: COUPON_BATCH_STATUS.EXPIRED,
                        updater,
                    }
                }],
                { session },
            )
            console.log('update CB:' ,upd);
            if (!upd.acknowledged) isProcPass = false;
            const updC = await modelCoupon.updateMany(
                {
                    batchId: { $in: { ids }}
                },
                [{
                    $set:{ 
                        status: COUPON_BATCH_STATUS.EXPIRED,
                        updater,
                        $push: {
                            logs: {
                                description: lang.zhTW.CouponExpired,
                                transferDate: myDate.toDateTimeString(),
                                transferDateTS: d.getTime(),                          
                            }                        
                        }
                    }
                }],
                { session },                        
            )
            if (!updC.acknowledged) isProcPass = false;
            if (isProcPass) {
                await session.commitTransaction();
            } else {
                await session.abortTransaction();
            }
        }
        // 檢查是否為App會員，以memberId的長度
        // filter.$expr = {
        //     $gt: [
        //         {"$strLenCP" : "$memberId"}, 4,
        //     ]
        // }
        //const finds = await modelCoupon.countDocuments(filter);
        // console.log("finds:", finds);

        // 已發行，且已過期優惠券處理
        isProcPass = true;
        filter.status = COUPON_STATUS.NOT_USED;
        const groups = await modelCoupon.aggregate([
            {
                $match: filter,
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1},
                }
            }
        ]);
        console.log("groups:", groups);
        if (isProcPass && groups.length > 0) {
            const monOptions = { ...TIME_SETTING.options };
            monOptions.month = 'numeric';
            const yearOptions = { ...TIME_SETTING.options};
            monOptions.year = 'numeric';
            // const smonth = d.toLocaleString(TIME_SETTING.locale, monOptions);
            // const syear = d.toLocaleString(TIME_SETTING.locale, yearOptions);
            // const month = parseInt(smonth);
            // const year = parseInt(syear);
            const {year, month} = myDate.getYearMonth();
            const promises = groups.map((group) => {
                return modelCS.updateOne(
                    { type: group._id, year, month },
                    { 
                        $inc: { 
                            electronicUnused: group.count * -1,
                            electronicExpired: group.count 
                        }
                    },
                    { upsert: true , session },
                );
            })
            const ansAll = await Promise.all(promises);
            ansAll.forEach((ans)=> {
                if (!ans.acknowledged) isProcPass = false;
            })
            console.log('promiseAll:', ansAll);
        }
        if (isProcPass ) {
            console.log('filter:', filter);
            const updCP = await modelCoupon.updateMany(
                filter,
                // [{
                //     $set: 
                // }],
                {
                        status: COUPON_STATUS.EXPIRED,
                        updater: {
                            modifiedByWho: 'system',
                            modifiedAt: Date.now(),
                            //lastValue: "$status",
                        },
                        $push: {
                            logs: {
                                description: lang.zhTW.CouponExpired,
                                transferDate: myDate.toDateTimeString(),
                                transferDateTS: d.getTime(),                          
                            }
                        }
                    },
                { session },
            );
            console.log('updCP', updCP);
            if (!updCP.acknowledged) isProcPass = false;
        }
        if (isProcPass) {
            await session.commitTransaction();
        } else {
            await session.abortTransaction();
        }
        await session.endSession();
    } catch (error) {
        console.log('couponsExpiredCheck error:', error);
    }
}