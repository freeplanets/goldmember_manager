import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE, MEMBER_LEVEL } from '../utils/enum';
import { ERROR_MESSAGE, KS_MEMBER_STYLE_FOR_SEARCH, PHONE_STYLE_FOR_SEARCH, STATUS_CODE } from '../utils/constant';
import { MembersDirectorStatusRequestDto } from '../dto/members/members-director-status-request.dto';
import { MembersConvertToShareholderRequestDto } from '../dto/members/members-convert-to-shareholder-request.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { MEMBER_DEFAULT_FIELDS, MEMBER_DETAIL_FIELDS } from '../utils/base-fields-for-searh';
import { IMember } from '../dto/interface/member.if';
import { IModifiedBy } from '../dto/interface/modifyed-by.if';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { MembersResponseDto } from '../dto/members/members-response.dto';
import { DtoErrMsg, ErrCode } from '../utils/enumError';
import { MembersIdResponseDto } from '../dto/members/members-id-response.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { MemberData } from '../dto/members/member.data';
import { isNumberString } from 'class-validator';
import { IUser } from '../dto/interface/user.if';
import { MemberGrowth, MemberGrowthDocument } from '../dto/schemas/member-growth.schema';
import { IMemberGrowth } from '../dto/interface/report.if';
import { MemberTransferLog, MemberTransferLogDocument, MemberTransferLogSchema } from '../dto/schemas/member-transfer-log.schema';
import { v1 as uuidv1 } from 'uuid';
import { MemberShareholderSwitch } from '../classes/member/member-shareholder-switch';
import { MemberTransferLogDto } from '../dto/members/member-transfer-log.dto';
import { MemberTransferLogRes } from '../dto/members/member-transfer-log-response';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel:Model<MemberDcoument>,
    @InjectModel(KsMember.name) private ksMemberModel:Model<KsMemberDocument>,
    @InjectModel(MemberGrowth.name) private modelMG:Model<MemberGrowthDocument>,
    @InjectModel(MemberTransferLog.name) private modelMTL:Model<MemberTransferLogDocument>,
    @InjectConnection() private readonly connection:mongoose.Connection,
  ){}
  async members(search: string, type: string = ''): Promise<MembersResponseDto> {
    console.log("members", search, type);
    let isSearchKsMemberToo = false;
    const mbrRes = new MembersResponseDto();
    try {
      if (isNumberString(search)) {
        if (search.length < 3) {
          mbrRes.ErrorCode = ErrCode.ERROR_PARAMETER;
          mbrRes.error.extra = 'at least 3 digitals';
          return mbrRes;
        }
      }
      const filter:FilterQuery<IMember> = {};
      if (KS_MEMBER_STYLE_FOR_SEARCH.test(search)){
        filter.systemId = { $regex: `${search}.*` };
        isSearchKsMemberToo = true;
      } else if (PHONE_STYLE_FOR_SEARCH.test(search)) {
        filter.phone = { $regex: `${search}.*`};
      } else {
        filter.$or = [
              {name: {$regex: `.*${search}.*`}},
              {displayName: {$regex: `.*${search}.*`}}
            ];
      }
      if (type && type !== MEMBER_LEVEL.ALL && type.indexOf('*') === -1) {
        filter.membershipType = type;
      }
      console.log(filter);
      const ans = await this.memberModel.find(filter, `${MEMBER_DEFAULT_FIELDS} phone systemId`);
      const mbrs:Partial<IMember>[] = ans.map((item) => item);
      console.log('isSearchKsMemberToo:', isSearchKsMemberToo);
      if (isSearchKsMemberToo && type !== MEMBER_LEVEL.GENERAL_MEMBER && type.indexOf('*') === -1) {
        console.log('search ks member');
        const ksFilter:FilterQuery<KsMemberDocument> = {};
        ksFilter.no = { $regex: `${search}.*` };
        console.log('ksFilter:', ksFilter);
        const ksMbrs = await this.ksMemberModel.find(ksFilter);
        console.log('ksMbrs:', ksMbrs.length);
        if (ksMbrs.length) {
          ksMbrs.forEach((item) => {
            const tmp:Partial<IMember> = {
              id: item.no,
              systemId: item.no,
              name: item.name,
              displayName: item.name,
              gender: item.gender,
              birthDate: item.birthday,
              isNotAppMember: true,
            };
            mbrs.push(tmp);
          });
        }        
      }
      if (!ans) mbrRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
      else mbrRes.data = mbrs;
    } catch (e) {
      mbrRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      mbrRes.error.extra = e;
    }
    return mbrRes;
  }

  async membersId(id: string): Promise<MembersIdResponseDto> {
    const mbrRes = new MembersIdResponseDto();
    try {
      let isSearchKsMemberToo = false
      const filter:FilterQuery<IMember> = {};
      if (KS_MEMBER_STYLE_FOR_SEARCH.test(id)){
          filter.systemId = { $regex: `${id}.*` };
          isSearchKsMemberToo = true;
      } else {
          filter.id = id;
      }
      const rlt = await this.memberModel.findOne(filter, MEMBER_DETAIL_FIELDS);
      console.log('member detail:', rlt);
      if (!rlt){
        if (isSearchKsMemberToo) {
          const ksFilter:FilterQuery<KsMemberDocument> = {};
          ksFilter.no = id
          const ksMbrs = await this.ksMemberModel.findOne(ksFilter);
          if (ksMbrs) {
            const tmp:Partial<IMember> = {
              id: ksMbrs.no,
              systemId: ksMbrs.no,
              name: ksMbrs.name,
              displayName: ksMbrs.name,
              gender: ksMbrs.gender,
              birthDate: ksMbrs.birthday,
              isNotAppMember: true,
            }
            mbrRes.data = tmp as MemberData;
          } else {
            mbrRes.ErrorCode = ErrCode.KS_MEMBER_NOT_FOUND;
          }
        } else {
          mbrRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
        }
      } else mbrRes.data = rlt as MemberData;
    } catch (e) {
      mbrRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      mbrRes.error.extra = e;
    }
    return mbrRes;
  }

  async membersIdDirectorStatus(
    id: string,
    membersDirectorStatusRequestDto: MembersDirectorStatusRequestDto,
    user:Partial<IUser>,
  ): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const f = await this.memberModel.findOne({id}, 'name isDirector');
      if (f) {
        const modifier:IModifiedBy = {
          modifiedBy: user.id,
          modifiedByWho: user.username,
          modifiedAt: Date.now(),
          lastValue: f.isDirector,
        }
        const rlt = await this.memberModel.updateOne(
          {id}, 
          {
            isDirector: membersDirectorStatusRequestDto.isDirector,
            directorStatusLastModified: modifier,
          }
        );
        if (rlt.acknowledged) {
          const transferLog:Partial<MemberTransferLog> = {
            id: uuidv1(),
            memberId: id,
            memberName: f.name,
            isDirector: membersDirectorStatusRequestDto.isDirector,
            modifiedBy: user.id,
            modifiedByWho: user.username,
            modifiedAt: Date.now(),
          };
          const saveLog = await this.addMemberTransferLog(transferLog);
          console.log('saveLog', saveLog);
        }
      } else {
        comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
        comRes.error.extra = {
          id: {
            check: DtoErrMsg.ID_ERROR,
            value: id,
          }
        }
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async membersConvertToShareholder(
    membersConvertToShareholderRequestDto: MembersConvertToShareholderRequestDto,
    user:Partial<IUser>,
  ): Promise<CommonResponseDto> {
    const memberSW = new MemberShareholderSwitch(
      this.memberModel,
      this.ksMemberModel,
      this.modelMTL,
      this.modelMG,
      this.connection,
    );
    return await memberSW.membertypesSwitch(membersConvertToShareholderRequestDto, user);
  }

  // async membersConvertToShareholder(
  //   membersConvertToShareholderRequestDto: MembersConvertToShareholderRequestDto,
  //   user:Partial<IUser>,
  // ): Promise<CommonResponseDto> {
  //   const comRes = new CommonResponseDto();
  //   try {
  //     const {id, membershipType, systemId } = membersConvertToShareholderRequestDto;
  //     if (membershipType === MEMBER_LEVEL.SHARE_HOLDER || membershipType === MEMBER_LEVEL.DEPENDENTS || membershipType === MEMBER_LEVEL.GENERAL_MEMBER) {
  //       // const { user } = req as any;
  //       const isSystemIdExists = await this.memberModel.findOne({systemId}, 'id');
  //       console.log('isSystemIdExists', isSystemIdExists);
  //       if (isSystemIdExists) {
  //         comRes.ErrorCode = ErrCode.SHARE_HOLDER_ALREADY_BE_TAKEN;
  //         return comRes;
  //       }
  //       const member = await this.memberModel.findOne({id}, 'name membershipType systemId');
  //       if (member) {
  //         const ksno = systemId ? systemId : member.systemId; 
  //         const ksmember = await this.ksMemberModel.findOne({no: ksno}, 'id no appUser');
  //         if (ksmember) {
  //           const session = await this.connection.startSession();
  //           session.startTransaction();
  //           console.log('sessioin:', session.id);
  //           const modifier:IModifiedBy = {
  //             modifiedBy: user.id,
  //             modifiedByWho: user.username,
  //             modifiedAt: Date.now(),
  //             lastValue: member.membershipType,
  //           }
  //           const saveMember = await this.memberModel.updateOne({id},{
  //             membershipType: membershipType,
  //             membershipLastModified: modifier,
  //             systemId: systemId,
  //           });
  //           console.log('saveMember', saveMember)
  //           const transferLog:Partial<MemberTransferLog> = {
  //             id: uuidv1(),
  //             memberId: id,
  //             memberName: member.name,
  //             oldMembershipType: member.membershipType,
  //             newMembershipType: membershipType,
  //             modifiedBy: user.id,
  //             modifiedByWho: user.username,
  //             modifiedAt: Date.now(),
  //           }
  //           let SaveOk = false;
  //           if (saveMember.acknowledged) {
  //             const saveKs = await this.ksMemberModel.updateOne({no: systemId}, {appUser: id});
  //             console.log('saveKs', saveKs);
  //             if (saveKs.acknowledged) {
  //               // await session.commitTransaction();
  //               // ifSaveError = true;
  //               SaveOk = await this.modifyMG(membershipType);
  //               if (SaveOk) {
  //                 SaveOk = await this.addMemberTransferLog(transferLog);
  //                 if (SaveOk) {
  //                   await session.commitTransaction();
  //                 }                
  //               }
  //             }
  //           }
  //           if (!SaveOk) {
  //             await session.abortTransaction();
  //             comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
  //           }
  //           await session.endSession(); 
  //         } else {
  //           comRes.ErrorCode = ErrCode.KS_MEMBER_NOT_FOUND;
  //         }
  //       } else {
  //         comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
  //       }
  //     } else {
  //       comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
  //       comRes.error.extra = DtoErrMsg.SHARE_HOLDER_ERROR;
  //     }
  //   } catch (e) {
  //     console.log("member transfer:", e);
  //     comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
  //     comRes.error.extra = e;
  //   }
  //   return comRes;
  // }
  async modifyMG(membershipType:MEMBER_LEVEL) {
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
      myMG.regularGrowth -= 1;
      if (membershipType === MEMBER_LEVEL.SHARE_HOLDER) {
        myMG.shareholderGrowth += 1;
      } else {
        myMG.familyGrowth += 1;
      }
      const upesert = await this.modelMG.updateOne({year, month}, myMG, {upsert:true});
      console.log('modifyMG', upesert);
      modifyOK = true;
    } catch (e) {
      console.log('modifyMG error:', e)
    }
    return modifyOK;
  }
  async addMemberTransferLog(transferLog:Partial<MemberTransferLog>):Promise<boolean> {
    //const mtl = new this.modelMTL(transferLog);
    try {
      const rlt = await this.modelMTL.create(transferLog);
      console.log('addMemberTransferLog', rlt);
      return true;
    } catch (e) {
      console.log('addMemberTransferLog error:', e);
      return false;
    }
  }
async getMembersTransferLog(req:MemberTransferLogDto):Promise<MemberTransferLogRes> {
    const comRes = new MemberTransferLogRes();
    try {
      const filter:FilterQuery<MemberTransferLogDocument> = {};
      if (req.memberId) {
        filter.memberId = req.memberId;
      } 
      if (req.memberName) {
        filter.memberName = {$regex: `.*${req.memberName}.*`};
      }
      const rlt = await this.modelMTL.find(filter, {_id: 0, __v: 0});
      console.log('getMembersTransferLog', rlt);
      if (rlt) {
        comRes.data = rlt;
      } else {
        comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      }
    } catch (e) {
      console.log('getMembersTransferLog error:', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
}
