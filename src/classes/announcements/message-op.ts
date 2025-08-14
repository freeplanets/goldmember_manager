import { DateLocale } from '../common/date-locale';
import {v1 as uuidv1} from 'uuid';
import { MessageType } from '../../utils/enum';
import { Model } from 'mongoose';
import { AnnouncementDocument } from '../../dto/schemas/announcement.schema';
import { IAnnouncement } from '../../dto/interface/announcement.if';
import { IbulkWriteItem } from '../../dto/interface/common.if';

export class MessageOp {
    private myDate = new DateLocale();
    private bluks:IbulkWriteItem<AnnouncementDocument>[]=[]
    constructor(private db:Model<AnnouncementDocument>){}
    createPersonalMsg(targetId:string, msg:string) {
        const cont:Partial<IAnnouncement> = {
            id: uuidv1(),
            //targetId,
            targetGroups: [
                {id: targetId}
            ],
            publishDate: this.myDate.toDateString(),
            expiryDate: this.myDate.AddMonth(3),
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
            return this.db.bulkWrite(this.bluks as any, opt);
        } else {
            return true;
        }
    }
}