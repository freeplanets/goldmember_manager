import mongoose, { Model } from 'mongoose';
import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { MemberDocument } from '../../dto/schemas/member.schema';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { IMember } from '../../dto/interface/member.if';
import { COUPON_STATUS } from '../../utils/enum';
import { v4 as uuidv4} from 'uuid';

export interface ICouponCreate {
    create(data:Partial<ICouponBatch>,session:mongoose.mongo.ClientSession):Promise<void>;
}

export abstract class ACouponCreate {
    constructor(
        protected data:Partial<ICouponBatch>,
        protected readonly ksM:Model<KsMemberDocument>,
        protected readonly mbrM:Model<MemberDocument>,
        protected readonly cpM:Model<CouponDocument>,
        protected readonly session:mongoose.mongo.ClientSession,
    ) {}
    get Data() {
        return this.data;
    }
    abstract create():Promise<boolean>;
    createCoupon(mbr:Partial<IMember>):Partial<ICoupon> {
        const tmp:Partial<ICoupon> = {
            batchId: this.data.id,
            //status:  mbr.id ? COUPON_STATUS.NOT_USED : COUPON_STATUS.NOT_ISSUED,
            id: uuidv4(),
            memberId: mbr.id,
            type: this.data.type,
            mode: this.data.mode,
            issueDate: this.data.issueDate,
            expiryDate: this.data.expiryDate,
            description: this.data.description,
            originalOwner: mbr.systemId ? mbr.systemId : mbr.id,
        }

        tmp.status =  mbr.id ? COUPON_STATUS.NOT_USED : COUPON_STATUS.NOT_ISSUED;
        return tmp      
    }
}