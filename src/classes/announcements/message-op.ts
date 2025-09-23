import { DateLocale } from '../common/date-locale';
import {v1 as uuidv1} from 'uuid';
import { MessageType } from '../../utils/enum';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { AnnouncementDocument } from '../../dto/schemas/announcement.schema';
import { IAnnouncement } from '../../dto/interface/announcement.if';
import { IbulkWriteItem } from '../../dto/interface/common.if';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { KS_MEMBER_STYLE_FOR_SEARCH } from '../../utils/constant';
import lang from '../../utils/lang';

export class MessageOp {
    private myDate = new DateLocale();
    private bluks:IbulkWriteItem<AnnouncementDocument>[]=[]
    constructor(private db:Model<AnnouncementDocument>){}
    createPersonalMsg(targetId:string, title: string, msg:string) {
        const cont:Partial<IAnnouncement> = {
            id: uuidv1(),
            //targetId,
            targetGroups: [
                {id: targetId}
            ],
            publishDate: this.myDate.toDateString(),
            expiryDate: this.myDate.AddMonth(3),
            title,
            content: msg,
            type: MessageType.INDIVIDUAL,
            isPublished: true,
            publishedTs: Date.now(),
            authorizer: {
                modifiedByWho: targetId,
                modifiedBy: targetId,
                modifiedAt: Date.now(),
            }
        }
        this.bluks.push({
            insertOne: {
                document: cont as any,
            }
        })
        //return await this.db.create(cont);
    }
    async send(session?: any): Promise<any> {
        //const bb:mongo.BulkWriteOptions= {session}
        if (this.bluks.length > 0) {
            let opt = {}
            if (session) opt = {session}
            const sends =  await this.db.bulkWrite(this.bluks as any, opt);
            this.bluks = [];
            return sends;
        } else {
            return true;
        }
    }
    async sendMsgForCouponIssue(
        BathId:string, 
        count:number, 
        model:Model<CouponDocument>,
        session?:mongoose.mongo.ClientSession,
    ):Promise<any> {
        const title = '優惠券轉贈通知';
        const msg = lang.zhTW.CouponIssueToAppUser.replace('{count}', String(count));
        const cpns = await model.find({batchId: BathId}).distinct('memberId');
        //const cpns = await model.distinct('memberId', filter)
        // const cpns = await model.aggregate([
        //     {
        //         $match: {
        //             batchId: BathId,
        //         },
        //         $group: {
        //             _id: {
        //                 memberId: '$memberId',
        //                 memberName: '$memberName',
        //             }
        //         }
        //     }
        // ]);
        //console.log('aggregate', cpns)
        cpns.forEach((memberId) => {
            if(!KS_MEMBER_STYLE_FOR_SEARCH.test(memberId)) {
                // console.log('send msg to', memberId);
                this.createPersonalMsg(memberId, title, msg);
            }
        });
        return this.send(session);
    }
}