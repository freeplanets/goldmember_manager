import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { dbInit } from '../utils/database/db-op';
import { Upload2S3 } from '../utils/upload-2-s3';
import { IReturnObj } from '../dto/interface/common.if';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
import { Member, MemberDocument } from '../dto/schemas/member.schema';
import { PushToken, PushTokenDocument } from '../dto/schemas/push-token.schema';
import { CommonResponseData } from '../dto/common/common-response.data';
import { PushTokenReqDto } from '../dto/devices/push-token-request.dto';
import { ErrCode } from '../utils/enumError';
import { FilesInspection } from '../classes/announcements/files-inspection';
import { CommonResponseDto } from '../dto/common/common-response.dto';
//import { ImageVerify } from '../classes/announcements/context-check/images-verify';
//import { PdfFile } from '../classes/announcements/context-check/pdf-file';
//import * as BadWords from 'bad-words-chinese';
//import { ExcelFile } from '../classes/announcements/context-check/excel-file';
//import { WordFile } from '../classes/announcements/context-check/word-file';
//import { getBadFilesOp } from '../classes/announcements/context-check/bad-file-op';

@Injectable()
export class ExecService {
    private upload2S3 = new Upload2S3('', 'images.uuss.net/models/mobilenet_v2');
    //private badWordsFilter = new BadWords();
    constructor(
        @InjectModel(KsMember.name) private readonly modelKs:Model<KsMemberDocument>,
        @InjectModel(Member.name) private readonly modelMember:Model<MemberDocument>,
        @InjectModel(PushToken.name) private readonly modelPT:Model<PushTokenDocument>,
    ){}

    async getKsMember() {
        return this.modelKs.find().sort({no: 1});
    }

    async initData() {
        const db = new dbInit();
        await db.getCollection();
        return ;
    }
    async verifyImage(
      file:Express.Multer.File|Array<Express.Multer.File>, 
      token:any
    ) {
      const fileschk = new FilesInspection();
      console.log('file:', file);
      const ans = fileschk.verify(file);
      return ans;
    }
    // private async verify(file:Express.Multer.File, text = '') {
    //     const rtn:IReturnObj = {}
    //     if (file) {
    //         const badFilesOp = getBadFilesOp(this.badWordsFilter);
    //         await badFilesOp.check(file);
    //         rtn.error = badFilesOp.Error;
    //         if (text) {
    //             const ans = this.badWordsFilter.isProfane(text);
    //             console.log('text isProfane:', ans);
    //         }
    //     }        
    //     return rtn;
    // }
    // private async verifyImg(file:Express.Multer.File, text='') {
    //     const rtn:IReturnObj = {};
    //     if (file) {
    //         console.log('verifyImg file', file);
    //         const imgVfg = new ImageVerify();
    //         if (file.mimetype.indexOf('image') !== -1) {
    //             rtn.data = await imgVfg.check(file);
    //         }
    //         if (file.mimetype === 'text/plain') {
    //             rtn.data = file.buffer.toString('utf8');
    //             if (typeof rtn.data === 'string') {
    //                 const ans = this.badWordsFilter.isProfane(rtn.data);
    //                 console.log('text badwords ans:', ans);
    //             }                
    //         }
    //         if (file.mimetype === 'application/pdf') {
    //             const pdf = new PdfFile();
    //             rtn.data = await pdf.parse(file);
    //             console.log('typeof:', typeof rtn.data);
    //             if (typeof rtn.data === 'string') {
    //                 const ans = this.badWordsFilter.isProfane(rtn.data);
    //                 console.log('pdf badwords ans:', ans);
    //             }
    //         }
    //         if (
    //             file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //             file.mimetype === 'application/vnd.ms-excel'
    //         ) {
    //             const excel = new ExcelFile();
    //             rtn.data = excel.parse(file);
    //             if (typeof rtn.data === 'string') {
    //                 const ans = this.badWordsFilter.isProfane(rtn.data);
    //                 console.log('excel badwords ans:', ans);
    //             }
    //         }
    //         if (
    //             file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //             file.mimetype === 'application/msword'
    //         ) {
    //             const word = new WordFile();
    //             rtn.data = await word.parse(file);
    //             if (typeof rtn.data === 'string') {
    //                 const ans = this.badWordsFilter.isProfane(rtn.data);
    //                 console.log('word badwords ans:', ans);
    //             }
    //         }
    //     }
    //     if (text) {
    //         const ans = this.badWordsFilter.isProfane(text);
    //         console.log('text isProfane:', ans);
    //     }
    //     return rtn;
    // }
    async uploads(files:Express.Multer.File[]) {
        return FuncWithTryCatchNew(this, 'upload', files);
    }
    private async upload(files:Express.Multer.File[]) {
        const rtn:IReturnObj = {};
        const promises = files.map((file) =>  this.upload2S3.uploadFile(file, false));
        //console.log("files", files);
        // const upload = this.uploadFile(file);
        rtn.data = await Promise.all(promises);
        return rtn;
    } 
  async getPushToken(req:PushTokenReqDto) {
    const res = new CommonResponseData();
    const filter:FilterQuery<MemberDocument> = {};
    const searchItems:string[] = [];
    if (!req.os) req.os = 'both';
    switch(req.os.toLowerCase()) {
      case 'ios':
        filter['devices.deviceType'] = 'iOS';
        searchItems.push('iOS');
        break;
      case 'android':
        filter['devices.deviceType'] = 'Android';
        searchItems.push('Android');
        break;
      default:
        filter.$or = [
          {'devices.deviceType' : 'iOS'},
          {'devices.deviceType' : 'Android'}
        ];
        searchItems.push('Android');
        searchItems.push('iOS');
    }
    if (req.phone) {
      filter.phone = { $in: req.phone };
    }
    console.log('getPushToken filter:', filter);
    try {
      const deviceIds:string[] = [];
      const ans = await this.modelMember.find(filter, 'devices');
      ans.forEach((itm) => {
        console.log('itm devices:', itm.devices);
        itm.devices.forEach((device) => {
          if (searchItems.indexOf(device.deviceType) !== -1) {
            deviceIds.push(device.deviceId);
          }
        })
      });
      if (deviceIds.length>0) {
        console.log('deviceIds:', deviceIds);
        res.data = await this.modelPT.find({deviceId: { $in: deviceIds }});
      }
      //res.data = ans;
    } catch (error) {
      console.log('get push token error:', error);
      res.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      res.error.extra = error.message;
    }
    return res;
  }
  async delFile() {
    const file = 'https://images.uuss.net/linkougolf/cb9c8750-241d-11f0-a0cb-59f72f49a345.png';
    const s3 = new Upload2S3();
    const ans = await s3.delFile(file);
    const comRes = new CommonResponseDto();
    if (!ans) comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
    return comRes;
  }
}