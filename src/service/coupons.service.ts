import { Injectable } from '@nestjs/common';
import { COUPON_BATCH_ISSUANCE_METHOD, COUPON_BATCH_STATUS, COUPON_STATUS, MEMBER_EXTEND_GROUP } from '../utils/enum';
import { CouponRequestDto } from '../dto/coupons/coupon-request.dto';
import { IUser } from '../dto/interface/user.if';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CouponBatch, CouponBatchDocument } from '../dto/schemas/coupon-batch.schema';
import mongoose, { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { Coupon, CouponDocument } from '../dto/schemas/coupon.schema';
import { ICoupon, ICouponAutoIssuedLog, ICouponBatch, ICouponTransferLog } from '../dto/interface/coupon.if';
import { v1 as uuidv1} from 'uuid';
import { IModifiedBy } from '../dto/interface/modifyed-by.if';
import { CouponListResponseDto } from '../dto/coupons/coupon-list-response.dto';
import { DtoErrMsg, ErrCode } from '../utils/enumError';
import { CouponResponseDto } from '../dto/coupons/coupon-response.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { CouponBatchesResponseDto } from '../dto/coupons/coupon-batches-response.dto';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { COUPON_BATCH_DETAIL_FIELDS } from '../utils/base-fields-for-searh';
import { CouponBatchesIdResponseDto } from '../dto/coupons/coupon-batches-id-response.dto';
import { MainFilters } from '../classes/filters/main-filters';
import { CouponStats, CouponStatsDocument } from '../dto/schemas/coupon-stats.schema';
import { CouponFunc } from '../utils/coupons/coupon-func';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { ICouponStats } from '../dto/interface/report.if';
import { CouponAutoIssuedLog, CouponAutoIssuedLogDocument } from '../dto/schemas/coupon-auto-issued-log.schema';
import { CouponLogRes } from '../dto/coupons/coupon-log-response';
import { CouponTransferLogReqDto } from '../dto/coupons/coupon-transfer-log-request.dto';
import { CouponTransferLogRes } from '../dto/coupons/coupon-transfer-log-response';
import { CouponTransferLog, CouponTransferLogDocument } from '../dto/schemas/coupon-transfer-log.schema';
import { IbulkWriteItem } from '../dto/interface/common.if';
import { Coupon2PaperDto } from '../dto/coupons/coupon-2-paper.dto';
import lang from '../utils/lang';
import { CommonResponseData } from '../dto/common/common-response.data';
import { DateLocale } from '../classes/common/date-locale';

@Injectable()
export class CouponsService {
  private myFilter = new MainFilters();
  private cpFunc = new CouponFunc();
  private myDate = new DateLocale();
  constructor(
    @InjectModel(CouponBatch.name) private readonly modelCouponBatch:Model<CouponBatchDocument>,
    @InjectModel(Coupon.name) private readonly modelCoupon:Model<CouponDocument>,
    @InjectModel(Member.name) private readonly modelMember:Model<MemberDcoument>,
    @InjectModel(CouponStats.name) private readonly modelCS:Model<CouponStatsDocument>,
    @InjectModel(KsMember.name) private readonly modelKS:Model<KsMemberDocument>,
    @InjectModel(CouponAutoIssuedLog.name) private readonly modelCAIL:Model<CouponAutoIssuedLogDocument>,
    @InjectModel(CouponTransferLog.name) private readonly modelCTL:Model<CouponTransferLogDocument>,
    @InjectConnection() private readonly connection:mongoose.Connection,
  ){}
  async coupons(
    couponRequestDto: CouponRequestDto,
  ): Promise<CouponListResponseDto> {
    const clRes = new CouponListResponseDto();
    try {
      let isFilterSet= false;
      const filter:FilterQuery<CouponDocument> = {}
      Object.keys(couponRequestDto).forEach((key) => {
        isFilterSet = true;
        // filter[key] = couponRequestDto[key];
        //if (key==='status') {
          // filter.$and = [
          //   {status: couponRequestDto.status },
          //   {status: { $ne: COUPON_STATUS.NOT_ISSUED }},
          // ]
        //} else {
          filter[key] = couponRequestDto[key];
        //}
      })
      if (isFilterSet) {
        // if (!filter.status && !filter.$and) {
        //   filter.status = { $ne: COUPON_STATUS.NOT_ISSUED };
        // }
        console.log('filter:', filter);
        const rlt = await this.modelCoupon.find(filter);
        if (rlt) clRes.data = rlt;  
      } else {
        clRes.ErrorCode = ErrCode.ERROR_PARAMETER;
      }
    } catch (e) {
      clRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      clRes.error.extra = e;
    }
    return clRes;
  }

  async couponsCode(id: string): Promise<CouponResponseDto> {
    const cpRes = new CouponResponseDto();
    try {
      const rlt = await this.modelCoupon.findOne({id});
      if (rlt) cpRes.data = rlt;
      else {
        cpRes.ErrorCode = ErrCode.COUPON_NOT_FOUND;
      }
    } catch (e) {
      cpRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      cpRes.error.extra = e;
    }
    return cpRes;
  }

  async couponsCodeUse(id: string[], notes:string, user:Partial<IUser>): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const coupons = await this.modelCoupon.find({id: {$in: id}}, 'id memberName type issueDate status');
      const bluks:IbulkWriteItem<CouponDocument>[]=[];
      for (let i=0, n=coupons.length; i<n; i+=1) {
        const coupon = coupons[i];
        switch(coupon.status) {
          case COUPON_STATUS.NOT_USED:
          //case COUPON_STATUS.READY_TO_USE:
            const collector: IModifiedBy = {
              modifiedBy: user.id,
              modifiedByWho: user.username,
              modifiedAt: Date.now(),
            }
            const log:Partial<ICouponTransferLog> = {};
            const memo = notes ? ',memo:' + notes : '';
            log.description = `使用 對象:${coupon.memberName}${memo} op:${user.username}`;
            log.transferDate = this.myDate.toDateTimeString();
            log.transferDateTS = Date.now();
            bluks.push({
              updateOne: {
                filter: {id: coupon.id},
                update: { 
                  status: COUPON_STATUS.USED, 
                  usedDate: this.myDate.toDateString(), 
                  collector,
                  $push: { logs: log},
                } 
              }
            })
            // const rlt = await this.modelCoupon.updateOne(
            //   { id }, 
            //   { 
            //     status: COUPON_STATUS.USED, 
            //     usedDate: this.myDate.toDateString(), 
            //     collector,
            //     $push: { logs: log},
            //   }
            // )
            // await this.modifyCouponStatsUsed(coupon);
            // console.log(rlt);
            break;
          case COUPON_STATUS.CANCELED:
            comRes.ErrorCode = ErrCode.COUPON_CANCELED_ERROR;
            return comRes;
          case COUPON_STATUS.NOT_ISSUED:
            comRes.ErrorCode = ErrCode.COUPON_NOT_ISSUED_ERROR;
            return comRes;
          case COUPON_STATUS.USED:
            comRes.ErrorCode = ErrCode.COUPON_USED_ERROR;
            return comRes;
        }
      }
      if (bluks.length > 0) {
        const upd = await this.modelCoupon.bulkWrite(bluks as any);
        console.log('conpon use upd:', upd);
        if (upd) {
          for (let i=0, n=coupons.length; i<n; i+=1) {
            await this.modifyCouponStatsUsed(coupons[i]);
          }            
        }
      }
      // if (!rlt) comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
    } catch (e) {
      console.log('couponCodeUse error:', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async couponsCodeConvertToPaper(coupon2papers:Coupon2PaperDto[], user:Partial<IUser>): Promise<CommonResponseDto>{
    const comRes = new CommonResponseDto();
    try {
      const ids:string[] = coupon2papers.map((cpn) => cpn.id);
      const coupons = await this.modelCoupon.find({
        id: {$in: ids},
        $or: [
          {toPaperNo: {$exists: false}},
          {toPaperNo: ''}
        ]
      }, 'type issueDate status');
      if (coupons.length > 0) {
        const d = new Date();
        const bulks:IbulkWriteItem<CouponDocument>[] =[];
        coupon2papers.forEach(coup => {
          ids.push(coup.id);
          const log:Partial<ICouponTransferLog> = {
            description: `${lang.zhTW.CouponToPaper}${coup.toPaperNo}`,
            transferDate: this.myDate.toDateTimeString(),
            transferDateTS: d.getTime(),
          }
          bulks.push({
            updateOne: {
              filter: {id: coup.id},
              update: {
                toPaperNo: coup.toPaperNo,
                $push: { logs: log}
              },
            }
          })
        });
        const session = await this.connection.startSession();
        session.startTransaction()
        const upd = await this.modelCoupon.bulkWrite(bulks as any, {session});
        console.log('couponsCodeConvertToPaper upd:', upd);
        if (upd.modifiedCount) {
          const promises = coupons.map((coupon) => this.modifyCouponStatsToPaper(coupon, session));
          const allAns = await Promise.all(promises);
          const ans = allAns.every((a) => a);
          if (ans) {
            await session.commitTransaction();
          } else {
            await session.abortTransaction();
          }
        } else {
          await session.abortTransaction();
        }
        await session.endSession();
      } else {
        comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
      }
    } catch (error) {
      console.log('couponsCodeConvertToPaper error:', error);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = error.message;
    }
    return comRes;
  }
  async couponsCodeConvertToPaperOld(coupon2paper:Partial<ICoupon>, user:Partial<IUser>): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const coupon = await this.modelCoupon.findOne({id: coupon2paper.id}, 'type issueDate status');
      if (coupon) {
        switch(coupon.status) {
          case COUPON_STATUS.NOT_USED:
          //case COUPON_STATUS.READY_TO_USE:
            const updater: IModifiedBy = {
              modifiedBy: user.id,
              modifiedByWho: user.username,
              modifiedAt: Date.now(),
            }
            const session = await this.connection.startSession();
            session.startTransaction();
            const rlt = await this.modelCoupon.updateOne(
              { id: coupon2paper.id }, 
              { toPaperNo: coupon2paper.toPaperNo, updater },
              { session }
            )
            await this.modifyCouponStatsToPaper(coupon, session);
            console.log(rlt);
            break;
          case COUPON_STATUS.CANCELED:
            comRes.ErrorCode = ErrCode.COUPON_CANCELED_ERROR;
            break;
          case COUPON_STATUS.NOT_ISSUED:
            comRes.ErrorCode = ErrCode.COUPON_CANCELED_ERROR;
            break;
          case COUPON_STATUS.USED:
            comRes.ErrorCode = ErrCode.COUPON_USED_ERROR;
            break;
        }
      } else {
        comRes.ErrorCode = ErrCode.COUPON_NOT_FOUND;
      }
    } catch (e) {
      console.log('couponsCodeCovertToPaper error:', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async couponBatches(cblrd:Partial<ICouponBatch>): Promise<CouponBatchesResponseDto> {
    const cbRes = new CouponBatchesResponseDto();
    try {
      let filter = this.myFilter.baseDocFilter<CouponBatchDocument, ICouponBatch>(cblrd.targetGroups, cblrd.type, cblrd.extendFilter);
      console.log('filter:', filter);
      if (!filter) filter = {}
      if (cblrd.status) {
          filter.status = cblrd.status;
      }
      //if (!filter) filter = {}
      if (cblrd.issueMode) {
        filter.issueMode = cblrd.issueMode;
      } else {
        filter.issueMode = { $ne: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC };
      }
      if (filter) console.log('filter:', filter, filter.$and, filter.$or);
      const list = await this.modelCouponBatch.find(filter, COUPON_BATCH_DETAIL_FIELDS);
      if (list) cbRes.data = list as Partial<ICouponBatch>;
    } catch (e) {
      console.log("couponBatches error:", e);
      cbRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      cbRes.error.extra = e;
    }
    return cbRes;
  }

  async couponBatchesPost(
    couponBatchPostDto: Partial<ICouponBatch>,
    user: Partial<IUser>,
  ): Promise<CommonResponseDto> {
    const comRes = new CommonResponseData();
    try {
      couponBatchPostDto.creator = {
        modifiedBy: user.id,
        modifiedByWho: user.username,
        modifiedAt: Date.now(),
      }
      couponBatchPostDto.id = uuidv1();
      if (couponBatchPostDto.extendFilter && couponBatchPostDto.extendFilter[0] === MEMBER_EXTEND_GROUP.BIRTH_OF_MONTH) {
        couponBatchPostDto.birthMonth = new Date().getMonth() + 1; // 未填預設為當月份
      }
      if (couponBatchPostDto.issueMode === COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC) {
        if (!couponBatchPostDto.frequency) {
          comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
          comRes.error.extra = DtoErrMsg.MISS_FREQUENCY;
          return comRes;
        }
      }
      //const bci = new BirthCouponsIssue(this.modelKs, this.modelMember, this.modelCoupon);
      //await bci.create(couponBatchPostDto);
      let session:mongoose.mongo.ClientSession | undefined;
      if (couponBatchPostDto.issueMode === COUPON_BATCH_ISSUANCE_METHOD.MANUAL) {
        // couponBatchPostDto.status = COUPON_BATCH_STATUS.ISSUED;
        session = await this.connection.startSession();
        session.startTransaction();
      }
      // if (couponBatchPostDto.issueDate) {
      //   couponBatchPostDto.issueDate = this.myDate.toDateString(couponBatchPostDto.issueDate);
      // } 
      // if (couponBatchPostDto.expiryDate) {
      //   couponBatchPostDto.expiryDate = this.myDate.toDateString(couponBatchPostDto.expiryDate);
      // } else 
      if (couponBatchPostDto.validityMonths) {
        const d = couponBatchPostDto.issueDate ? couponBatchPostDto.issueDate : this.myDate.toDateString(); //new Date(); 
        const eD = this.myDate.AddMonthLessOneDay(couponBatchPostDto.validityMonths, d);
        couponBatchPostDto.expiryDate = eD;  //this.myDate.toDateString(eD);
      }
      const rlt = await this.modelCouponBatch.create([couponBatchPostDto], {session});
      console.log('create coupon batch:', rlt);
      if (rlt) {
        comRes.data = rlt;
        if (session) {
          const ins = await this.cpFunc.insertCoupons(
            couponBatchPostDto, 
            this.modelCouponBatch,
            this.modelMember,
            this.modelCoupon,
            this.modelKS,
            COUPON_STATUS.NOT_ISSUED,
            session
          );
          if (ins) {
            const commit = await session.commitTransaction();
            console.log('commit:', commit);
            //comRes.data = rlt;
          } else {
            comRes.ErrorCode = ErrCode.COUPONBATCH_ISSUED_ERROR;
            comRes.data = undefined;
            const abt = await session.abortTransaction();
            console.log('abort:', abt);
          }
          session.endSession();
        }
      }
    } catch (e) {
      console.log('couponBatchesPost', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async couponBatchedId(id: string): Promise<CouponBatchesIdResponseDto> {
    const cbdRes = new CouponBatchesIdResponseDto();
    try {
      const rlt = await this.modelCouponBatch.findOne({id});  //, COUPON_BATCH_DETAIL_FIELDS);
      if (rlt) cbdRes.data = rlt;
      else {
        cbdRes.ErrorCode = ErrCode.COUPONBATCH_NOT_FOUND;
      }
    } catch (e) {
      cbdRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      cbdRes.error.extra = e;
    }
    return cbdRes;
  }

  async couponBatchedIdPut(
    id: string,
    couponBatchPostDto: Partial<ICouponBatch>,
    user:Partial<IUser>,
  ): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const cpn = await this.modelCouponBatch.findOne({id}, 'issueMode');
      if (cpn) {
        if (cpn.issueMode === COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC) {
          comRes.ErrorCode = ErrCode.COUPONBATCH_ISSUED_ERROR;
          return comRes;
        }
        couponBatchPostDto.updater = {
          modifiedBy: user.id,
          modifiedByWho: user.username,
          modifiedAt: Date.now(),
        }
        const ans =  await this.modelCouponBatch.findOneAndUpdate({id}, couponBatchPostDto);
        console.log('couponBatchedIdPut:', ans);
      } else {
        comRes.ErrorCode = ErrCode.COUPONBATCH_NOT_FOUND;
      }
    } catch (e) {
      console.log('couponBatchedIdPut error:', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async couponBatchedIdAuthorize(id: string, user:Partial<IUser>): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    let session:mongoose.ClientSession;
    try {
      const cb:Partial<ICouponBatch> = await this.modelCouponBatch.findOne({id});
      console.log('couponBatchedIdAuthorize:', cb);
      if (cb) {
        switch(cb.status) {
          case COUPON_BATCH_STATUS.CANCELED:
            comRes.ErrorCode = ErrCode.COUPONBATCH_CANCEL_CANCELED;
            return comRes;
          case COUPON_BATCH_STATUS.ISSUED:
            comRes.ErrorCode = ErrCode.COUPONBATCH_CANCEL_ISSUED;
            return comRes;
          case COUPON_BATCH_STATUS.NOT_ISSUED:
            session = await this.connection.startSession();
            session.startTransaction();
            const authorizer:IModifiedBy = {
              modifiedAt: Date.now(),
              modifiedByWho: user.username,
              modifiedBy: user.id,
            }
            const updFilter:FilterQuery<CouponDocument> = {
              batchId: id,
            }
            let upd:UpdateWriteOpResult;
            // if (cb.issueMode === COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC) {
            //   if (!authReq.issueDate) {
            //       await session.endSession()
            //       comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
            //       comRes.error.extra = 'miss parameter issueDate';
            //       return comRes;                
            //   }
            //   const cailF:FilterQuery<CouponAutoIssuedLogDocument> = {
            //     batchId: id,
            //     issueDate: authReq.issueDate,
            //   }
            //   const f = await this.modelCAIL.findOne(cailF);
            //   if (f) {
            //     if (f.status === COUPON_BATCH_STATUS.ISSUED) {
            //       await session.endSession()
            //       comRes.ErrorCode = ErrCode.COUPONBATCH_CANCEL_ISSUED;
            //       return comRes;
            //     }
            //     updFilter.issueDate = authReq.issueDate;
            //     upd = await this.modelCAIL.updateOne(
            //       {batchId: id, issueDate: authReq.issueDate},
            //       {status: COUPON_BATCH_STATUS.ISSUED, authorizer},
            //       {session},
            //     )
            //   } 
            // } else {
              upd = await this.modelCouponBatch.updateOne({id}, {status: COUPON_BATCH_STATUS.ISSUED, authorizer}, {session});
            //}
            console.log('couponbatch update:', upd);
            const updCP = await this.modelCoupon.updateMany(
              // {batchId: id, notAppMember: false}, // 只變更 app user
              // {batchId: id}, // 改為全部變更所有人
              updFilter,
              {status: COUPON_STATUS.NOT_USED}
            )
            if (updCP.modifiedCount) {
              await this.modifyCouponStatsCB(cb, session);
              const commit = await session.commitTransaction();
              console.log('commit:', commit);
            } else {
              comRes.ErrorCode = ErrCode.COUPONBATCH_AUTHORIZE_ERROR;
              const abt = await session.abortTransaction();
              console.log('abort:', abt);
            }
            await session.endSession();
        }
      } else {
        comRes.ErrorCode = ErrCode.COUPONBATCH_NOT_FOUND;
      }
    } catch (e) {
      if (session) {
        await session.abortTransaction();
        await session.endSession();
      }
      console.log('couponBatchedIdAuthorize error:', e);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async couponBatchedIdCancel(id: string, user:Partial<IUser>): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const cb = await this.modelCouponBatch.findOne({id});
      console.log('couponBatchedIdCancel:', cb);
      if (cb) {
        switch(cb.status) {
          case COUPON_BATCH_STATUS.CANCELED:
            comRes.ErrorCode = ErrCode.COUPONBATCH_CANCEL_CANCELED;
            return comRes;
          case COUPON_BATCH_STATUS.ISSUED:
            comRes.ErrorCode = ErrCode.COUPONBATCH_CANCEL_ISSUED;
            return comRes;
          case COUPON_BATCH_STATUS.NOT_ISSUED:
            const authorizer:IModifiedBy = {
              modifiedBy: user.id,
              modifiedByWho: user.username,
              modifiedAt: Date.now(),
              lastValue: cb.status
            }
            const session = await this.connection.startSession();
            session.startTransaction();
            let isProcPass = false;
            const upd = await this.modelCouponBatch.updateOne(
              {id, status: COUPON_BATCH_STATUS.NOT_ISSUED}, 
              {authorizer, status: COUPON_BATCH_STATUS.CANCELED},
              {session}
            );
            if (upd.acknowledged) {
              const updD = await this.modelCoupon.updateMany(
                { batchId: id },
                { status: COUPON_STATUS.CANCELED },
                { session }
              );
              if (updD.acknowledged) {
                isProcPass = true;
              }
            }
            //console.log('couponBatchedIdCancel upd:', upd);
            if (isProcPass) {
              await session.commitTransaction();
            } else {
              await session.abortTransaction();
              comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
            }
            await session.endSession();
        }
      } else {
        comRes.ErrorCode = ErrCode.COUPONBATCH_NOT_FOUND;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async modifyCouponStatsUsed(coupon:Partial<ICoupon>) {
    console.log('modifyCouponStatsUsed:', coupon);
    const year = Number(coupon.issueDate.split('/')[0]);
    const cStats = await this.modelCS.findOne({type: coupon.type, year});
    const data = this.initCouponStat();
    if (cStats) {
      Object.keys(data).forEach((key) => {
        data[key] = cStats[key];
      });
      data.electronicUsed += 1;
      data.electronicUnused -= 1;
      const upd = await this.modelCS.updateOne({type: coupon.type, year}, data);
      console.log('modifyCouponStatsUsed:', upd);
    }
  }
  private async modifyCouponStatsCB(cb:Partial<ICouponBatch>, session:mongoose.ClientSession) {
    const couponCount = await this.modelCoupon.countDocuments({
      batchId: cb.id, 
      status: COUPON_STATUS.NOT_USED,
      notAppMember: false,
    });
    console.log('couponCount:', couponCount);
    //const year = Number(cb.issueDate.split('/')[0]);
    //const month = Number(cb.issueDate.split('/')[1]);
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const data = this.initCouponStat();
    const cStats = await this.modelCS.findOne({type: cb.type, year, month});
    if (cStats) {
        data.electronicCount = cStats.electronicCount + couponCount;
        data.electronicUnused = cStats.electronicUnused + couponCount;
    } else {
        data.electronicCount = couponCount;
        data.electronicUnused = couponCount;
    }
    const upsert = await this.modelCS.updateOne({type: cb.type, year, month}, data, {upsert: true, session});
    console.log('modifyCouponStats upsert:', upsert);
    return upsert;
  }
  async modifyCouponStatsToPaper(coupon:Partial<ICoupon>, session:mongoose.mongo.ClientSession) {
    //const year = Number(coupon.issueDate.split('/')[0]);
    const {year, month} = this.myDate.getYearMonth();
    const cStats = await this.modelCS.findOne({type: coupon.type, year, month});
    console.log('cStats:', cStats);
    const data = this.initCouponStat();
    if (cStats) {
      Object.keys(data).forEach((key) => {
        if (cStats[key]) data[key] = cStats[key];
      });
    }
    data.paperCount += 1;
    data.paperUnused += 1;
    data.electronicCount -= 1;
    data.electronicUnused -= 1;
    console.log('data:', data);
    const upd = await this.modelCS.updateOne({type: coupon.type, year, month}, data, {upsert:true, session});
    console.log('modifyCouponStatsToPaper:', upd);
    return !!upd.acknowledged;
  }
  async automaticStop(id:string, user:Partial<IUser>) {
    const comRes = new CommonResponseDto();
    try {
      const upd = await this.modelCouponBatch.updateOne(
        {id, issueMode: COUPON_BATCH_ISSUANCE_METHOD.AUTOMATIC},
        {status: COUPON_BATCH_STATUS.STOPPED}
      )
      console.log('automaticStop', upd);
    } catch (error) {
      console.log('automaticStop error:', error);
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = error.message;
    } 
    return comRes;
  }
  initCouponStat():Partial<ICouponStats> {
    return {
      electronicCount: 0,
      electronicExpired: 0,
      electronicInvalid: 0,
      electronicUnused: 0,
      electronicUsed: 0,
      paperCount: 0,
      paperExpired: 0,
      paperInvalid: 0,
      paperUnused: 0,
      paperUsed: 0,
    };
  }
  async getCouponLog(conponLogReq:Partial<ICouponAutoIssuedLog>):Promise<CouponLogRes> {
    const cplogRes = new CouponLogRes();
    const filters:FilterQuery<CouponBatchDocument> = {};
    if (conponLogReq.batchId) {
      filters.originId = conponLogReq.batchId
    } else {
      filters.$and = [
        {originId: {$exists: true} },
        {originId: {$ne: ''}},
      ]
    }
    if (conponLogReq.name) {
      filters.name = { $regex: `${conponLogReq.name}.*` };
    }
    if (conponLogReq.type) {
      filters.type = conponLogReq.type;
    }
    console.log('filter:', filters)
    try {
      const ans = await this.modelCouponBatch.find(filters, {_id: false, __v: false});
      cplogRes.data = ans.map((cb) => {
        const tmp:ICouponAutoIssuedLog = {
          batchId: cb.id,
          issueDate: cb.issueDate,
          totalCoupons: cb.numberOfIssued,
          name: cb.name,
        }
        return tmp;
      })
      // cplogRes.data = await this.modelCouponBatch.find(filters, {_id: false, __v: false});
    } catch (e) {
      console.log('getCouponLog error:', e);
      cplogRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      cplogRes.error.extra = e;
    }
    return cplogRes;
  }
  async getTransferLog(coupReq:CouponTransferLogReqDto):Promise<CouponTransferLogRes>{
    const cplogRes = new CouponTransferLogRes();
    const filters:FilterQuery<CouponDocument> = {};
    if (coupReq.couponId) {
      //filters.couponId = coupReq.couponId;
      filters.id = coupReq.couponId;
    }
    // if (coupReq.memberName) {
    //   filters.$or = [
    //     { newOwner: { $regex: `${coupReq.memberName}.*` }},
    //     { originalOwner: { $regex: `${coupReq.memberName}.*` }},
    //   ];
    // }
    // if (coupReq.memberId) {
    //   if (!filters.$or) filters.$or = [];
    //   filters.$or.push(
    //     { newOwnerId: coupReq.memberId },
    //     { originalOwnerId: coupReq.memberId },
    //   );
    // }
    try {
      console.log('getTransferLog filters:', filters);
      // cplogRes.data = await this.modelCTL.find(filters, {_id: false, __v: false});
      const coup = await this.modelCoupon.findOne(filters);
      if (coup) {
        cplogRes.data = coup.logs;
      }
    } catch (e) {
      console.log('getTransferLog error:', e);
      cplogRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      cplogRes.error.extra = e;
    }
    return cplogRes;
  }
}
