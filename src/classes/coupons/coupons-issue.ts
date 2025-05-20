import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { IMember } from '../../dto/interface/member.if';
import { COUPON_STATUS } from '../../utils/enum';
import { v4 as uuidv4} from 'uuid';

export class CouponsIssue  {
    create(
        mbrs:Partial<IMember>[], 
        data:Partial<ICouponBatch>, 
        coupon_status=COUPON_STATUS.NOT_USED
    ):Partial<ICoupon>[]|false {
        console.log('CouponsIssue create!');
        let result:Partial<ICoupon>[]| false =false;
        try {
            //const mbrs = await this.getMember();
            console.log('mbr:', mbrs.length);
            const coupons:Partial<ICoupon>[]=[];
            mbrs.forEach((mbr:Partial<IMember>) => {
                for (let i=0; i<data.couponsPerPerson; i++) {
                    coupons.push(this.createCoupon(mbr, data, coupon_status));
                }
            });
            result = coupons;
        } catch (e) {
            console.log('create coupon:', e);
            result = false
        }
        return result;
    }
    private createCoupon(mbr:Partial<IMember>, data:Partial<ICouponBatch>, coupon_status:COUPON_STATUS ):Partial<ICoupon> {
        const tmp:Partial<ICoupon> = {
            batchId: data.id,
            name: data.name,
            //status:  mbr.id ? COUPON_STATUS.NOT_USED : COUPON_STATUS.NOT_ISSUED,
            id: uuidv4(),
            memberId: mbr.id ? mbr.id : mbr.systemId,
            memberName: mbr.name,
            type: data.type,
            mode: data.mode,
            issueDate: data.issueDate,
            expiryDate: data.expiryDate,
            description: data.description,
            notAppMember: mbr.id ? false : true,
            originalOwnerId: mbr.id ? mbr.id : mbr.systemId,
            originalOwner: mbr.name,
            status: coupon_status,
        }
        // console.log('createCoupon:', tmp);
        return tmp      
    }    
}