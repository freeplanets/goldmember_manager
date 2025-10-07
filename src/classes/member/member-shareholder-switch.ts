import mongoose, { Model } from 'mongoose';
import { MemberGrowthDocument } from '../../dto/schemas/member-growth.schema';
import { MemberTransferLogDocument } from '../../dto/schemas/member-transfer-log.schema';
import { MemberDocument } from '../../dto/schemas/member.schema';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { COUPON_STATUS, MEMBER_LEVEL } from '../../utils/enum';
import { MembersConvertToShareholderRequestDto } from '../../dto/members/members-convert-to-shareholder-request.dto';
import { IUser } from '../../dto/interface/user.if';
import { CommonResponseDto } from '../../dto/common/common-response.dto';
import { ErrCode } from '../../utils/enumError';
import { IMember } from '../../dto/interface/member.if';
import { IKsMember } from '../../dto/interface/ks-member.if';
import { IMemberGrowth } from '../../dto/interface/report.if';
import { v1 as uuidv1 } from 'uuid';
import { CouponDocument } from '../../dto/schemas/coupon.schema';
import { ICouponTransferLog } from '../../dto/interface/coupon.if';
import lang from '../../utils/lang';
import { DateLocale } from '../common/date-locale';

export class MemberShareholderSwitch {
    private mTypes = [MEMBER_LEVEL.SHARE_HOLDER, MEMBER_LEVEL.DEPENDENTS, MEMBER_LEVEL.GENERAL_MEMBER];
    private myDate = new DateLocale();
    constructor(
        private readonly modelMember: Model<MemberDocument>,
        private readonly modelKsMember: Model<KsMemberDocument>,
        private readonly modelMTL: Model<MemberTransferLogDocument>,
        private readonly modelMG: Model<MemberGrowthDocument>,
        private readonly modelCoupon: Model<CouponDocument>,
        private readonly connection: mongoose.Connection,
    ){}
    async membertypesSwitch(req: MembersConvertToShareholderRequestDto,
    user:Partial<IUser>){
        let comRes = new CommonResponseDto();
        const {id, membershipType, systemId } = req;
        try {
            const f = this.mTypes.find((item) => item === membershipType);
            if (f) {
                const member = await this.modelMember.findOne({id}, 'id name membershipType systemId');
                if (member) {
                    comRes = this.memberTypeCheck(member, membershipType, systemId);
                    if (!comRes.errorcode) {
                        const ksno = systemId ? systemId : member.systemId;
                        const ksMember = await this.modelKsMember.findOne({no: ksno}, 'no name appUser');
                        if (ksMember) {
                            const mbrData:Partial<IMember> = {
                                membershipType,
                                membershipLastModified: {
                                    modifiedBy: user.id,
                                    modifiedByWho: user.username,
                                    modifiedAt: Date.now(),
                                    lastValue: member.membershipType,
                                }
                            }
                            const ksMbrData:Partial<IKsMember> = {
                                appUser: id,                            
                            };
                            switch (membershipType) {
                                case MEMBER_LEVEL.SHARE_HOLDER:
                                case MEMBER_LEVEL.DEPENDENTS:
                                    mbrData.systemId = systemId;
                                    break;
                                case MEMBER_LEVEL.GENERAL_MEMBER:
                                    ksMbrData.appUser = null;
                                    mbrData.systemId = null;
                                    break;
                            }
                            const session = await this.connection.startSession();
                            session.startTransaction();
                            const mbrRes = await this.modelMember.updateOne({id}, mbrData, {session});
                            console.log('會員類型轉換結果', mbrRes);
                            let isProcPass = false;
                            if (mbrRes.modifiedCount > 0) {
                                const ksMbrRes = await this.modelKsMember.updateOne({no: ksno}, ksMbrData, {session});
                                console.log('國興會員轉換結果', ksMbrRes);
                                if (ksMbrRes.modifiedCount > 0) {
                                    const mtlData:Partial<MemberTransferLogDocument> = {
                                        id: uuidv1(),
                                        memberId: id,
                                        memberName: member.name,
                                        oldMembershipType: member.membershipType,
                                        newMembershipType: membershipType,
                                        //isDirector: member.isDirector,
                                        modifiedBy: user.id,
                                        modifiedByWho: user.username,
                                        modifiedAt: Date.now(),
                                    }
                                    const updLog = await this.modelMTL.create([mtlData], {session});
                                    console.log('會員轉換紀錄', updLog);
                                    if (updLog) {
                                        const modifyMG = await this.updateMemberGrowth(member.membershipType, membershipType, session);
                                        if (modifyMG) {
                                            isProcPass = true;
                                        } 
                                    }   
                                }
                                // check coupon is not_used transfer to AppUser
                                const log:Partial<ICouponTransferLog> = {
                                    description: `${member.name}${lang.zhTW.MemberTransferToShareHolder}(${ksno})`,
                                    transferDate: this.myDate.toDateTimeString(),
                                    transferDateTS: Date.now(),
                                };
                                const updCP = await this.modelCoupon.updateMany(
                                    {
                                        memberId: ksno,
                                        status: COUPON_STATUS.NOT_USED,
                                    },
                                    {
                                        memberId: member.id,
                                        memberName: member.name,
                                        notAppMember: false,
                                        $push: {
                                            logs: log,
                                        },
                                    },
                                    { session }
                                );
                                console.log('updCP:', updCP);
                            }
                            if (isProcPass) {
                                await session.commitTransaction();
                            } else {
                                await session.abortTransaction();
                                comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
                            }
                            session.endSession();
                        } else {
                            comRes.ErrorCode = ErrCode.KS_MEMBER_NOT_FOUND;
                        }
                    }
                } else {
                    comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                }
            } else {
                comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
                comRes.error.extra = {
                    membershipType: {
                        message: `會員類型轉換只包含 ${this.mTypes.join(',')}`,
                        value: membershipType,
                    }
                }
            }
        } catch (error) {
            console.error('轉換會員類型失敗', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error;
        }
        return comRes;
    }
    private memberTypeCheck(member:Partial<IMember>, membershipType: MEMBER_LEVEL, systemId:string){
        const comRes = new CommonResponseDto();
        if (member.membershipType !== membershipType) {
            if (membershipType !== MEMBER_LEVEL.GENERAL_MEMBER && !systemId) {
                comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
                comRes.error.extra = {
                    systemId: {
                        message: `轉換會員類型 ${membershipType} 需要國興會員代號`,
                        value: systemId,
                    }
                }
            }
        } else {
            comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
            comRes.error.extra = {
                membershipType: {
                    message: `會員目前類型 ${member.membershipType} 與轉換類型相同`,
                    value: membershipType,
                }
            }
        }
        return comRes;
    }
    private async updateMemberGrowth(oldMType:MEMBER_LEVEL, newMType:MEMBER_LEVEL, session: mongoose.ClientSession) {
        let modifyOK = false;
        try {
            const d = new Date();
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const mg = await this.modelMG.findOne({year, month});
            let myMG:Partial<IMemberGrowth> = {};
            if (mg) {
                myMG.regularGrowth = mg.regularGrowth;
                myMG.shareholderGrowth = mg.shareholderGrowth;
                myMG.familyGrowth = mg.familyGrowth;
            } else {
                myMG.regularGrowth = 0;
                myMG.shareholderGrowth = 0;
                myMG.familyGrowth = 0;
            }
            switch (oldMType) {
                case MEMBER_LEVEL.SHARE_HOLDER:
                    myMG.shareholderGrowth -= 1;
                    break;
                case MEMBER_LEVEL.DEPENDENTS:
                    myMG.familyGrowth -= 1;
                    break;
                case MEMBER_LEVEL.GENERAL_MEMBER:
                    myMG.regularGrowth -= 1;
                    break;
            }
            switch (newMType) {
                case MEMBER_LEVEL.SHARE_HOLDER:
                    myMG.shareholderGrowth += 1;
                    break;
                case MEMBER_LEVEL.DEPENDENTS:
                    myMG.familyGrowth += 1;
                    break;
                case MEMBER_LEVEL.GENERAL_MEMBER:
                    myMG.regularGrowth += 1;
                    break;
            }
            const upesert = await this.modelMG.updateOne({year, month}, myMG, {upsert:true, session});
            console.log('modifyMG', upesert);
            modifyOK = true;
        } catch (e) {
            console.log('modifyMG error:', e);
            modifyOK = false;
        }
        return modifyOK;
    }
}