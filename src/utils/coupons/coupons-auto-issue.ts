import { FilterQuery, Model } from 'mongoose';
import { CouponBatch, CouponBatchDocument, CouponBatchSchema } from '../../dto/schemas/coupon-batch.schema';
import { AddMonthLessOneDay, DateWithLeadingZeros } from '../common';
import { getMongoDB } from '../database/mongodb'
import { COUPON_BATCH_FREQUNCY, COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, COUPON_STATUS } from '../enum';
import { CouponFunc } from './coupon-func';
import { Member, MemberDcoument, MemberSchema } from '../../dto/schemas/member.schema';
import { KsMember, KsMemberDocument, KsMemberSchema } from '../../dto/schemas/ksmember.schema';
import { Coupon, CouponDocument, CouponSchema } from '../../dto/schemas/coupon.schema';
import { v1 as uuidv1} from 'uuid';
import { ICouponAutoIssuedLog, ICouponBatch } from '../../dto/interface/coupon.if';
import { CouponAutoIssuedLog, CouponAutoIssuedLogSchema } from '../../dto/schemas/coupon-auto-issued-log.schema';


export const couponsAutoIssue = async () => {
    console.log('couponsAutoIssue:', new Date().toLocaleString('zh-TW'));
    try {
        const db = await getMongoDB();
        // const connection = db.createConnection();
        const modelCB = db.model(CouponBatch.name, CouponBatchSchema);
        const modelMbr = db.model(Member.name, MemberSchema);
        const modelKS = db.model(KsMember.name, KsMemberSchema);
        const modelCP = db.model(Coupon.name, CouponSchema);
        const modelLog = db.model(CouponAutoIssuedLog.name, CouponAutoIssuedLogSchema);
        const cpFunc = new CouponFunc();
        const date = DateWithLeadingZeros();
        const filter:FilterQuery<CouponBatchDocument> = {
            issueDate: date,
            issueMode: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC,
            status: COUPON_BATCH_STATUS.NOT_ISSUED,
            couponCreated: false,
        }
        const foundCBs = await modelCB.find(filter);
        console.log('foundCBs:', foundCBs);
        for (let i=0, n=foundCBs.length; i< n; i++) {
            let isProcPass = false;
            const session = await db.startSession();
            console.log('session:', session.id);
            session.startTransaction();
            const ans = await cpFunc.insertCoupons(
                foundCBs[i], 
                modelMbr as Model<MemberDcoument>, 
                modelCP as Model<CouponDocument>, 
                modelKS as Model<KsMemberDocument>,
                COUPON_STATUS.NOT_ISSUED,
                session,
            );
            if (ans) {
                const log:ICouponAutoIssuedLog = {
                    BatchId: foundCBs[i].id,
                    name: foundCBs[i].name,
                    type: foundCBs[i].type,
                    totalCoupons: ans.insertedCount,
                    issueDate: foundCBs[i].issueDate,
                    originBatchId: foundCBs[i].originId,
                    issueDateTs: Date.now(),
                }
                const addLog = await modelLog.create([log], {session});
                console.log('add log:', addLog);
                if (addLog) {
                    const newCB:Partial<ICouponBatch> = {
                        name: foundCBs[i].name,
                        description: foundCBs[i].description,
                        type: foundCBs[i].type,
                        birthMonth: foundCBs[i].birthMonth,
                        mode: foundCBs[i].mode,
                        frequency: foundCBs[i].frequency,
                        validityMonths: foundCBs[i].validityMonths,
                        couponsPerPerson: 3,
                        issueMode: foundCBs[i].issueMode,
                        targetGroups: foundCBs[i].targetGroups,
                        extendFilter:foundCBs[i].extendFilter,
                        //issueDate: '2025/05/12',
                        //expiryDate: '2025/08/12',
                        status: foundCBs[i].status,
                        // couponCreated: true,
                        authorizer: foundCBs[i].authorizer
                    };
                    console.log('object check:', newCB );
                    newCB.originId = foundCBs[i].originId ? foundCBs[i].originId : foundCBs[i].id;
                    newCB.id = uuidv1();
                    newCB.issueDate = AddMonthByFrequency(newCB.issueDate, newCB.frequency);
                    if (newCB.validityMonths) {
                        newCB.expiryDate = AddMonthLessOneDay(newCB.validityMonths, newCB.issueDate);
                    }
                    if (newCB.birthMonth) {
                        newCB.birthMonth = new Date(newCB.issueDate).getMonth() + 1;
                    }
                    const addCB = await modelCB.create([newCB], {session});
                    console.log('add new coupon batch:' , addCB)
                    if (addCB) {
                        const updOldCB = await modelCB.updateOne({id: foundCBs[i].id}, {couponCreated: true}, {session});
                        console.log('update old coupon batch:', updOldCB);
                        if (updOldCB) {
                            isProcPass = true;
                        }
                    }
                } 
            }
            if (isProcPass) {
                session.commitTransaction();
            } else {
                session.abortTransaction();
            }
            session.endSession()
        }
    } catch (e) {
        console.log('couponsAutoIssue error:', e);
    }
}

function AddMonthByFrequency(date:string, frequency:string) {
    let addM=0;
    switch(frequency) {
        case COUPON_BATCH_FREQUNCY.MONTHLY:
            addM = 1;
            break;
        case COUPON_BATCH_FREQUNCY.QUARTERLY:
            addM = 3;
            break;
        case COUPON_BATCH_FREQUNCY.SEMI_ANNUAL:
            addM = 6;
        case COUPON_BATCH_FREQUNCY.YEARLY:
            addM = 12;
    }
    return AddMonthLessOneDay(addM, date);
}