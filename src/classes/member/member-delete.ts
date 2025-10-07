import mongoose, { Model, UpdateQuery } from 'mongoose';
import { MemberDocument } from '../../dto/schemas/member.schema';
import lang from '../../utils/lang';
import { FriendDocument } from '../../dto/schemas/friend.schema';
import { TeamDocument } from '../../dto/schemas/team.schema';
import { TeamMemberDocument } from '../../dto/schemas/team-member.schema';
import { IbulkWriteItem, IReturnObj } from '../../dto/interface/common.if';
import { ErrCode } from '../../utils/enumError';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { MemberGrowthDocument } from '../../dto/schemas/member-growth.schema';
import { Upload2S3 } from '../../utils/upload-2-s3';

// 將被刪除的資料：
// • App登入權限
// • 個人檔案和頭像
// • 社交功能相關資料
// • 推播通知設定
/**
 * member 轉換為 電話贈送優惠券會員
 * team & teammember
 * friends
 * drop member from s3
 */
export class MemberDelete {
    constructor(
        private readonly modelMbr:Model<MemberDocument>,
        private readonly modelKs:Model<KsMemberDocument>,
        private readonly modelMG:Model<MemberGrowthDocument>,
        private readonly modelFrd:Model<FriendDocument>,
        private readonly modelTeam:Model<TeamDocument>,
        private readonly modelTM:Model<TeamMemberDocument>,
        private readonly session:mongoose.mongo.ClientSession,
    ){}
    async remove(id:string){
        const rtn:IReturnObj = {};
        try {
            const mbr = await this.modelMbr.findOne({id});
            if (mbr && !mbr.isCouponTriggered) {
                this.session.startTransaction();
                await this.removeKsInfo(mbr, this.session);
                await this.removeMemberInfo(mbr, this.session);
                await this.removeFromFriendlist(mbr, this.session);
                await this.removeFromTeam(mbr, this.session);
                await this.removePic(mbr.pic);
                await this.session.commitTransaction();
                await this.session.endSession();
            }
        } catch (error) {
            await this.session.abortTransaction();
            await this.session.endSession();
            console.log('MemberDelete remove eror:', error);
            rtn.error = ErrCode.UNEXPECTED_ERROR_ARISE;
            rtn.extra = error.message;
        }
        return rtn;
    }
    async removeKsInfo(mbr:any, session:mongoose.mongo.ClientSession) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const ans = await this.modelMG.findOne({year, month});
        const update:UpdateQuery<MemberGrowthDocument> = {};        
        if(mbr.systemId) {
            const upd = await this.modelKs.updateOne({no: mbr.systemId, appUser: mbr.id}, {appUser: ''}, {session});
            console.log('removeKsInfo:', upd);
            if (upd.acknowledged) {
                if (ans) {
                    update.shareholderGrowth = ans.shareholderGrowth ? ans.shareholderGrowth-1: -1;
                } else {
                    update.shareholderGrowth = -1;
                }
            }
        } else {
            if (ans) {
                update.regularGrowth = ans.regularGrowth ? ans.regularGrowth-1: -1;
            } else {
                update.regularGrowth = -1;
            }
        }
        const updMG = await this.modelMG.updateOne({year, month}, update, {upsert:true, session});
        console.log('removeKsInfo updMG:', updMG);
    }
    async removeMemberInfo(mbr:any, session:mongoose.mongo.ClientSession) {
        console.log('mbr:', mbr);
        const reservfields = ['_id', '__v', 'id', 'phone'];
        const unset = {};
        Object.keys(mbr._doc).forEach((key) => {
            // console.log(key,'=>', mbr[key]);
            if (reservfields.indexOf(key) === -1 ) {
                unset[key] = 1;
            }
        });
        console.log('unset:', unset);
        const upd = await this.modelMbr.findOneAndUpdate(
            {_id:mbr._id},
            {
                $unset: unset,
            },
            { session }
        );
        console.log('removeMemberInfo upd:', upd);
        const upd1 = await this.modelMbr.findOneAndUpdate(
            {_id:mbr._id},
            {
                isCouponTriggered: true,
                notes: lang.zhTW.MemberDeleteAccount,
            },
            { session }
        );
        console.log('removeMemberInfo upd:', upd1);        
    }
    async removeFromFriendlist(mbr:any, session:mongoose.mongo.ClientSession) {
        const del = await this.modelFrd.deleteMany({
            $or:[
                {memberInfo: mbr._id},
                {memberId: mbr.id }
            ]
        }, {session});
        console.log('removeFromFriendlist:', del);
        return del;
    }
    async removeFromTeam(mbr:any, session:mongoose.mongo.ClientSession) {
        const res = await this.modelTM.find({memberInfo: mbr._id});
        const tmBulks:IbulkWriteItem<TeamMemberDocument>[] = [];
        const tBulks:IbulkWriteItem<TeamDocument>[] = [];
        for (let i=0, n=res.length; i < n; i++) {
            console.log('removeFromTeam res['+ String(i) +']', res[i]);
            tmBulks.push({
                deleteOne: {
                    filter: {
                        _id: res[i]._id,
                    }
                }
            });
            tBulks.push({
                updateOne: {
                    filter: { id: res[i].teamId },
                    update: {
                        $pull: { members: res[i]._id }
                    }
                }
            })
        }
        if (tmBulks.length > 0) {
            const del = await this.modelTM.bulkWrite(tmBulks as any, {session});
            console.log('removeFromTeam del TeamMember:', del);
        }
        if (tBulks.length > 0) {
            const upd = await this.modelTeam.bulkWrite(tBulks as any, {session});
            console.log('removeFromTeam pull team mebmers, upd:', upd);
        }
    }
    async removePic(picUrl:string) {
        if (picUrl && picUrl.indexOf('/linkougolf/') !== -1) {
            const s3 = new Upload2S3();
            const ans = await s3.delFile(picUrl);
            console.log(ans);
        }
    }
}