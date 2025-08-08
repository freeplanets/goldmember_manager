import { ICoupon, ICouponBatch } from '../../dto/interface/coupon.if';
import { IMember } from '../../dto/interface/member.if';
import { COUPON_STATUS } from '../../utils/enum';
import { v4 as uuidv4} from 'uuid';
import { REPLACE_MONTH, REPLACE_YEAR } from '../../utils/constant';
import { DateLocale, TIME_SETTING } from '../common/date-locale';

const myDate = new DateLocale();

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
            const d = new Date();
            const transferDate = myDate.toDateTimeString();
            const transferDateTS = d.getTime();
            console.log('mbr:', mbrs.length);
            const coupons:Partial<ICoupon>[]=[];
            mbrs.forEach((mbr:Partial<IMember>) => {
                for (let i=0; i<data.couponsPerPerson; i++) {
                    const cpn = this.createCoupon(mbr, data, coupon_status);
                    cpn.logs =  [
                        {
                            description: `發行 對象:${mbr.name}`,
                            transferDate,
                            transferDateTS,
                        }
                    ]
                    coupons.push(cpn);
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
        const [year, month, day] = data.issueDate.split('/');
        const tmp:Partial<ICoupon> = {
            batchId: data.id,
            name: data.name.replace(REPLACE_YEAR, year).replace(REPLACE_MONTH, month),
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