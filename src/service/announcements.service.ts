import { Injectable } from '@nestjs/common';
import { AnnouncementSearch } from '../dto/announcements/announcements-search.dto';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Announcement, AnnouncementDocument } from '../dto/schemas/announcement.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
//import { Attachment } from '../dto/announcements/attachment';
import { IAnnouncement } from '../dto/interface/announcement.if';
//import { v1 as uuidv1 } from 'uuid';
//import { ErrCode } from '../utils/enumError';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { IUser } from '../dto/interface/user.if';
//import { IModifiedBy } from '../dto/interface/modifyed-by.if';
import { AnnouncementFilterDto } from '../dto/announcements/announcement-filter.dto';
import { AnnouncementsFilterResponseDto } from '../dto/announcements/announcements-filter-response.dto';
import { AnnouncementsResponseDto } from '../dto/announcements/announcements-response.dto';
//import { AnnouncementData } from '../dto/announcements/announcement.data';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { AnnouncementsIdResponseDto } from '../dto/announcements/announcements-id-response.dto';
//import { AnnounceFieldsCheck } from '../dto/announcements/announce-fields-check';
import { MainFilters } from '../classes/filters/main-filters';
//import { Upload2S3 } from '../utils/upload-2-s3';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { DateLocale } from '../classes/common/date-locale';
import { AnnounceOp } from '../classes/announcements/announce-op';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
import { ORGANIZATION } from '../utils/constant';

@Injectable()
export class AnnouncementsService {
  // private AWS_S3_BUCKET = 'images.uuss.net/linkougolf';
  // private s3 = new AWS.S3({
  //   region: 'ap-southeast-1',
  // });
  //private Upload2S3 = new Upload2S3();
  private myFilter = new MainFilters();
  private myDate = new DateLocale();
  private annOp:AnnounceOp;
  constructor(
    @InjectModel(Announcement.name) private readonly modelAnnouncement:Model<AnnouncementDocument>,
    // @InjectModel(Announcement2Member.name) private readonly modelAnn2Member:Model<Announcement2MemberDocument>,
    @InjectModel(Member.name) private readonly modelMember:Model<MemberDcoument>,
    @InjectModel(KsMember.name) private readonly modelKs:Model<KsMemberDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ){
    this.annOp = new AnnounceOp(modelMember, modelKs, modelAnnouncement);
  }
  async getMemberCountByFilter(filters:AnnouncementFilterDto):Promise<AnnouncementsFilterResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'getMemberCountByFilter', filters)
    // const afRes = new AnnouncementsFilterResponseDto();
    // try {
    //   const filter = this.myFilter.membersFilter(filters.targetGroups, filters.extendFilter);
    //   const cnt = await this.modelMember.countDocuments(filter);
    //   const cntKs = await this.getKsMemberCount(filters);
    //   console.log("mbr:", cnt, "ksmbr:", cntKs);
    //   afRes.data = cnt + cntKs;
    // } catch(e) {
    //   console.log("getMemberCountByFilter error:", e);
    //   afRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   afRes.error.extra = e.message;
    // }
    // return afRes;
  }
  async announcementsGet(
    announcementSearch: AnnouncementSearch
  ): Promise<AnnouncementsResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsGet', announcementSearch);
    // const annRes = new AnnouncementsResponseDto();
    // try {
    //   let filters = this.myFilter.baseDocFilter<AnnouncementDocument, IAnnouncement>(
    //     announcementSearch.targetGroups,
    //     announcementSearch.type,
    //     announcementSearch.extendFilter,
    //   );
    //   // if (filters) {
    //   console.log('filter:',filters);
    //     if (!filters) filters = {};
    //     const threeMonthsAgo = this.myDate.AddMonthLessOneDay(-3);
    //     filters.publishDate = { $gte: threeMonthsAgo };
    //     console.log('filters:', filters);
    //     const rlt = await this.modelAnnouncement.find(filters);
    //     if (rlt) {
    //       annRes.data = (rlt as Partial<IAnnouncement[]>).map((itm) => {
    //         if (itm.attachments) {
    //           itm.attachments = itm.attachments.map((att) => {
    //             if (typeof att === 'string') {
    //               if (`${att}`.indexOf('"') !== -1) {
    //                 att = JSON.parse(att);
    //                 console.log('att:', att);
    //               }
    //             }
    //             return att;
    //           });
    //         }
    //         return itm;
    //       });
    //     }  
    //   // } else {
    //   //   annRes.ErrorCode = ErrCode.ERROR_PARAMETER;
    //   // }
    // } catch (e) {
    //   console.log(e);
    //   annRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   annRes.error.extra = e;
    // }
    // return annRes;
  }

  async announcementsPost(
    user:Partial<IUser>,
    announcementCreateDto:Partial<IAnnouncement>,
    files: Array<Express.Multer.File>,
  ): Promise<CommonResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsPost', user, announcementCreateDto, files);
    // const comRes = new CommonResponseDto();
    // try {
    //   const dtoChk = new AnnounceFieldsCheck(announcementCreateDto);
    //   if (dtoChk.Error) {
    //     comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
    //     comRes.error.extra = dtoChk.Error;
    //     return comRes;
    //   }
    //   announcementCreateDto = dtoChk.Data;
    //   console.log('after check:', announcementCreateDto);
    //   if (files.length > 0 ) {
    //     //const promises = files.map((file) => this.uploadFile(file))
    //     const promises = files.map((file) => this.upload(file))
    //     // const upload = this.uploadFile(file);
    //     const upload = await Promise.all(promises)
    //     console.log('upload:', upload);
    //     //const attachments = files.map((file) => {
    //     const attachments = [];
    //     upload.forEach((res) => {
    //       if (!res) return;
    //       const attachment:Attachment = {
    //         name: res.OriginalFilename,
    //         //url: `https://${this.AWS_S3_BUCKET}/${file.filename}`,
    //         url: res.fileUrl,
    //         size: res.filesize, 
    //       }
    //       attachments.push(attachment);
    //     });
    //     announcementCreateDto.attachments = attachments;
    //   }
    //   if (!announcementCreateDto.id) announcementCreateDto.id = uuidv1();
    //   announcementCreateDto.creator = {
    //     modifiedBy: user.id,
    //     modifiedByWho: user.username,
    //     modifiedAt: Date.now(),
    //   }
    //   if (announcementCreateDto.isPublished){
    //     console.log("write check");
    //     announcementCreateDto.publishedTs = Date.now();
    //   }
    //   const rlt = await this.modelAnnouncement.create(announcementCreateDto);
    //   console.log('announcementsPost', rlt);
    //   if (rlt) {
    //     console.log('announcementsPost pass true check');       
    //   }
    // } catch (e) {
    //   console.log('announcementPost error:', e);
    //   comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   comRes.error.extra = e;
    // }
    // return comRes;
  }

  async announcementsIdGet(id: string): Promise<AnnouncementsIdResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsIdGet', id);
    // const annRes = new AnnouncementsIdResponseDto();
    // try {
    //   const rlt = await this.modelAnnouncement.findOne({id});
    //   if (rlt) {
    //     if (rlt.attachments) {
    //       rlt.attachments = rlt.attachments.map((att) => {
    //         if (typeof att === 'string') {
    //           if (`${att}`.indexOf('"') !== -1) {
    //             att = JSON.parse(att);
    //             console.log('att:', att);
    //           }
    //         }
    //         return att;
    //       });
    //     }
    //     annRes.data = rlt as AnnouncementData;
    //   }
    // } catch (e) {
    //   annRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   annRes.error = {
    //     extra: e,
    //   }
    // }
    // return annRes;
  }

  async announcementsIdPut(
    user:Partial<IUser>,
    id: string,
    announceUpdateDto: Partial<IAnnouncement>,
    files:Express.Multer.File[],
  ): Promise<CommonResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsIdPut', user, id, announceUpdateDto, files);
    // const comRes = new CommonResponseDto();
    // try {
    //   const dtoChk = new AnnounceFieldsCheck(announceUpdateDto);
    //   if (dtoChk.Error) {
    //     comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
    //     comRes.error.extra = dtoChk.Error;
    //     return comRes;
    //   }
    //   console.log('after fields check:', dtoChk.Data);
    //   announceUpdateDto = dtoChk.Data;
    //   if (files.length > 0 ) {
    //     const promises = files.map((file) =>  this.upload(file));
    //     console.log("files", files);
    //     // const upload = this.uploadFile(file);
    //     const upload = await Promise.all(promises)
    //     console.log('upload:', upload);
    //     if (!announceUpdateDto.attachments) announceUpdateDto.attachments = [];
    //     upload.forEach((file) => {
    //       if (!file) return;
    //       console.log("file name:", file.OriginalFilename);
    //       const attachment:Attachment = {
    //         name: file.OriginalFilename,
    //         url: file.fileUrl, //`https://${this.AWS_S3_BUCKET}/${file.originalname}`,
    //         size: file.filesize, 
    //       }
    //       const f = announceUpdateDto.attachments.find((itm) => itm.name === attachment.name);
    //       if (!f) announceUpdateDto.attachments.push(attachment);
    //     });
    //   }
    //   announceUpdateDto.updater = {
    //     modifiedBy: user.id,
    //     modifiedByWho: user.username,
    //     modifiedAt: Date.now(),
    //   }
    //   if (announceUpdateDto.isPublished){
    //     console.log("update publish check");
    //     announceUpdateDto.publishedTs = Date.now();
    //   }
    //   const rlt = await this.modelAnnouncement.updateOne({id}, announceUpdateDto);
    //   console.log('announcementsPost', rlt);
    //   if (rlt) {
    //     console.log('announcementsPost pass true check');       
    //   }
    // } catch (e) {
    //   comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   comRes.error.extra = e;
    // }
    // return comRes;
  }

  async announcementsIdPublish(id: string, user:Partial<IUser>): Promise<CommonResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsIdPublish', id, user);
    // const comRes = new CommonResponseDto();
    // try {
    //   const ann = await this.modelAnnouncement.findOne(
    //     {id, authorizer: { $exists: false}}, 
    //     'publishDate expiryDate isPublished targetGroups method');
    //   if (ann) {
    //     //if (!ann.isPublished) {
    //       // const isSended = await this.sendMemberAnnouncement(ann);
    //       //const isPublished = await this.publishMemberAnnouncement(id);
          
    //         const authorizer:IModifiedBy = {
    //           modifiedBy: user.id,
    //           modifiedByWho: user.username,
    //           modifiedAt: Date.now(),
    //           lastValue: ann.isPublished,
    //         }
    //         const pDate = new Date(ann.publishDate);
    //         const updateData:Partial<IAnnouncement> = {
    //           isPublished: true,
    //           authorizer,
    //           publishedTs:pDate.getTime() > Date.now() ? pDate.getTime() :  Date.now()
    //         };
    //         const isModified = await this.modelAnnouncement.updateOne(
    //           {id}, 
    //           updateData,
    //         );
    //         console.log("announcementsIdPublish isModified:", isModified);
    //         if (!isModified.modifiedCount) {
    //           console.log("announcementsIdPublish isModified show false");
    //           comRes.ErrorCode = ErrCode.ANNOUNCE_PUBLISH_ERROR;
    //         }
    //     //}
    //   } else {
    //     comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
    //   }
    // } catch (e) {
    //   comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   comRes.error.extra = e;
    // }
    // return comRes;
  }

  async announcementsIdUnpublish(id: string, user:Partial<IUser>): Promise<CommonResponseDto> {
    return FuncWithTryCatchNew(this.annOp, 'announcementsIdUnpublish', id, user);
    // const comRes = new CommonResponseDto();
    // try {
    //   const ann = await this.modelAnnouncement.findOne({id}, 'isPublished');
    //   if (ann) {
    //     if (ann.isPublished || typeof (ann.isPublished) === 'undefined') {
    //       const authorizer:IModifiedBy = {
    //         modifiedBy: user.id,
    //         modifiedByWho: user.username,
    //         modifiedAt: Date.now(),
    //         lastValue: ann.isPublished,
    //       }
    //       const updateData:Partial<IAnnouncement> = {
    //         isPublished: false,
    //         authorizer,
    //         publishedTs: 0,
    //       };
    //       const upd = await this.modelAnnouncement.updateOne(
    //         {id}, 
    //         updateData,
    //       );
    //       console.log("announcementsIdUnpublish upd:", upd);
    //       if (!upd.modifiedCount) {
    //         comRes.ErrorCode = ErrCode.ANNOUNCE_PUBLISH_ERROR;
    //       }
    //     }
    //   } else {
    //     comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
    //   }
    // } catch (e) {
    //   console.log('announcementsIdUnpublish error:', e);
    //   comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
    //   comRes.error.extra = e;
    // }
    // return comRes;
  }
  // async upload(file:Express.Multer.File) {
  //   const upload2S3 = new Upload2S3();
  //   const upload = await upload2S3.uploadFile(file);
  //   console.log('after upload:', upload);
  //   if (upload) {
  //     //return  `${this.Upload2S3.S3_BUCKET_URL}/${file.originalname}`;
  //     return upload2S3.Response;
  //   }
  //   return false;
  // }
  // private async getKsMemberCount(filters:AnnouncementFilterDto) {
  //   const filter = this.myFilter.KsMemberFilter(filters.targetGroups, filters.extendFilter);
  //   console.log('filter:', filter);
  //   const cnt = Object.keys(filter).length;
  //   if (cnt > 0) {
  //       const ans = await this.modelKs.countDocuments(filter);
  //       return ans;
  //   }
  //   return 0;    
  // }
  // async uploadFile(file:Express.Multer.File) {
  //   console.log('file:', file);
  //   const { originalname } = file;
  //   const ary = originalname.split('.');
  //   const newname = `${uuidv1()}.${ary[ary.length-1]}`;
  //   //file.originalname = newname;
  //   file.filename = newname;
  //   return await this.s3_upload(
  //     file.buffer,
  //     this.AWS_S3_BUCKET,
  //     file.filename,
  //     file.mimetype,
  //     // file.encoding,
  //    )
  // }

  // async s3_upload(fileBuffer:Buffer|Uint8Array|Blob|string|Readable, bucket:string, name:string, mimetype:string, encoding:string | undefined = undefined) {
  //   const params: AWS.S3.PutObjectRequest = {
  //     Bucket: bucket,
  //     Key: String(name),
  //     Body: fileBuffer,
  //     // ACL: 'public-read',
  //     ContentType: mimetype,
  //     ContentDisposition: 'inline',
  //   };
  //   if (encoding) {
  //     params.ContentEncoding = encoding;
  //   }
  //   try {
  //     const s3Response = await this.s3.upload(params).promise();
  //     // console.log('s3 res:', s3Response);
  //     const downloadedFile = await this.s3.getObject({ Bucket: bucket, Key: name }).promise();
  //     console.log("download file:", downloadedFile.Body);
  //     return s3Response;
  //   } catch(e) {
  //     console.log("S3 Upload Error:", e);
  //     return false;
  //   }
  // }
  // async publishMemberAnnouncement(announcementId:string):Promise<boolean> {
  //   const upd = await this.modelAnn2Member.updateMany({announcementId}, {isPublished: true});
  //   if (upd) return true;
  //   return false;
  // }
  // async sendMemberAnnouncement(ann:Partial<IAnnouncement>):Promise<boolean> {
  //   try {
  //     const filter = this.createFilter(ann.targetGroups, ann.extendFilter);
  //     const members = await this.modelMember.find(filter);
  //     console.log('sendMemberAnnouncement', members);
  //     if (members.length>0) {
  //       const datas = members.map((member) => {
  //         const tmp:Partial<IAnnouncement2Member> = {
  //           id: uuidv1(),
  //           memberId: member.id,
  //           announcementId: ann.id,
  //           publishDate: ann.publishDate,
  //           isPublished: ann.isPublished,
  //         }
  //         if (ann.expiryDate) tmp.expiryDate = ann.expiryDate;
  //         return tmp;
  //       });
  //       const rlt = await this.modelAnn2Member.insertMany(datas);
  //       console.log('sendMemberAnn save', rlt);
  //       return true;
  //     }
  //     return false;      
  //   } catch (e) {
  //     console.log('sendMemberAnnouncement Error:', e);
  //     return false;
  //   }
  // }
  async refromData() {
    console.log('reformdata service start');
    const filter:FilterQuery<AnnouncementDocument> = {
      organization: {$exists: false}
    }
    const update:UpdateQuery<AnnouncementDocument> = {
      organization: ORGANIZATION,
    }
    console.log(filter, update);
    const ans = await this.modelAnnouncement.updateMany(filter, update);
    console.log('refromData ans:', ans);
    return ans;
  }
}
