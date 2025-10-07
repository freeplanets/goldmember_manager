import { FilterQuery, Model } from 'mongoose';
import { CouponBatch, CouponBatchDocument, CouponBatchSchema } from '../../dto/schemas/coupon-batch.schema';
import { getMongoDB } from '../database/mongodb'
import { COUPON_BATCH_FREQUNCY, COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, COUPON_STATUS } from '../enum';
import { CouponFunc } from './coupon-func';
import { Member, MemberDocument, MemberSchema } from '../../dto/schemas/member.schema';
import { KsMember, KsMemberDocument, KsMemberSchema } from '../../dto/schemas/ksmember.schema';
import { ICouponBatch } from '../../dto/interface/coupon.if';
import { CouponAutoIssuedLog, CouponAutoIssuedLogSchema } from '../../dto/schemas/coupon-auto-issued-log.schema';
import { v1 as uuidv1 } from 'uuid';
import { Coupon, CouponDocument, CouponSchema } from '../../dto/schemas/coupon.schema';
import { REPLACE_MONTH, REPLACE_YEAR } from '../constant';
import { DateLocale, TIME_SETTING } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export const couponsAutoIssue = async () => {
    const d = new Date();
    try {
        console.log('couponsAutoIssue UTC:', d.getTimezoneOffset(), d.toUTCString());
        console.log('couponsAutoIssue:', myDate.toDateString());
        const db = await getMongoDB();
        // const connection = db.createConnection();
        const modelCB = db.model(CouponBatch.name, CouponBatchSchema);
        const modelMbr = db.model(Member.name, MemberSchema);
        const modelKS = db.model(KsMember.name, KsMemberSchema);
        const modelCP = db.model(Coupon.name, CouponSchema);
        //const modelLog = db.model(CouponAutoIssuedLog.name, CouponAutoIssuedLogSchema);
        const cpFunc = new CouponFunc();
        const filter:FilterQuery<CouponBatchDocument> = {
            // issueDate: date,
            issueMode: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC,
            $and: [
                { status: { $ne: COUPON_BATCH_STATUS.STOPPED } },
                { status: { $ne: COUPON_BATCH_STATUS.CANCELED } },
            ],
            // status: COUPON_BATCH_STATUS.NOT_ISSUED,
            // couponCreated: false,
        }
        const fCBs = await modelCB.find(filter);
        console.log('foundCBs ans:', fCBs);
        const foundCBs = createForIssue(fCBs);
        console.log('foundCBs ans:', foundCBs);
        for (let i=0, n=foundCBs.length; i< n; i++) {
            let isProcPass = false;
            const newCB = foundCBs[i];
            const isIssued = await modelCB.findOne({originId: newCB.originId, issueDate: newCB.issueDate}) 
            // const isIssued = await modelLog.findOne({batchId: foundCBs[i].id, issueDate: foundCBs[i].issueDate});
            console.log('isIssued:', isIssued);
            if (isIssued) {
                console.log('coupon batch already issued:', isIssued.id);
                continue;
            }
            const session = await db.startSession();
            console.log('session:', session.id);
            session.startTransaction();
            //const newDoc = await modelCB.create(newCB);
            newCB.creator = {
                modifiedByWho: 'system auto',
                modifiedAt: Date.now(),
            }
            const newDoc = new modelCB(newCB);
            const created = await newDoc.save({session});
            console.log('newDoc created:', created);
            if (created) {
                const ans = await cpFunc.insertCoupons(
                    newCB,
                    modelCB as Model<CouponBatchDocument>, 
                    modelMbr as Model<MemberDocument>, 
                    modelCP as Model<CouponDocument>, 
                    modelKS as Model<KsMemberDocument>,
                    COUPON_STATUS.NOT_ISSUED,
                    session,
                );
                if (ans) {
                    isProcPass = true;
                }
            }
            if (isProcPass) {
                await session.commitTransaction();
            } else {
               await session.abortTransaction();
            }
            await session.endSession()
        }
    } catch (e) {
        console.log('couponsAutoIssue error:', e);
    }
}

function AddMonthByFrequency(date:string, frequency:string) {
    let addM=1;
    switch(frequency) {
        case COUPON_BATCH_FREQUNCY.MONTHLY:
            addM = 1;
            break;
        case COUPON_BATCH_FREQUNCY.QUARTERLY:
            addM = 3;
            break;
        case COUPON_BATCH_FREQUNCY.SEMI_ANNUAL:
            addM = 6;
            break;
        case COUPON_BATCH_FREQUNCY.YEARLY:
            addM = 12;
    }
    return myDate.AddMonth(addM, date);
    //return AddMonthLessOneDay(addM, date);
}

// create couponbatch from couponbatch issueMode autmatic
function createForIssue(datas:Partial<ICouponBatch>[]) {
    const needIssueCB:Partial<ICouponBatch>[] = [];
    const issueDate = myDate.toDateString();
    datas.forEach((data) => {
        let cpShouldIssueDate = data.issueDate;
        while(cpShouldIssueDate <= issueDate) {
            if (cpShouldIssueDate === issueDate) {
                const [year, month, day] = issueDate.split('/');
                const addMonth = data.validityMonths ? data.validityMonths : 1;
                const newDataForIssueCB:Partial<ICouponBatch> = {
                    id: uuidv1(),
                    name: data.name.replace(REPLACE_YEAR, year).replace(REPLACE_MONTH, month),
                    type: data.type,
                    issueMode: COUPON_BATCH_ISSUANCE_METHOD.MANUAL,
                    targetGroups: data.targetGroups,
                    extendFilter: data.extendFilter,
                    issueDate,
                    expiryDate: myDate.AddMonth(addMonth, issueDate),
                    description: data.description,
                    mode: data.mode,
                    couponsPerPerson: data.couponsPerPerson,
                    originId: data.id,
                }
                needIssueCB.push(newDataForIssueCB);
                break;
            }            
            cpShouldIssueDate = AddMonthByFrequency(cpShouldIssueDate, data.frequency);
            console.log('data check:', cpShouldIssueDate, issueDate);
        }
    });
    return needIssueCB;
}