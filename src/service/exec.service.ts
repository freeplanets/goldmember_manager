import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { dbInit } from '../utils/database/db-op';
import { Upload2S3 } from '../utils/upload-2-s3';
import { IReturnObj } from '../dto/interface/common.if';
import { FuncWithTryCatchNew } from '../classes/common/func.def';
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
    constructor(@InjectModel(KsMember.name) private readonly modelKs:Model<KsMemberDocument>){}

    async getKsMember() {
        return this.modelKs.find().sort({no: 1});
    }

    async initData() {
        const db = new dbInit();
        await db.getCollection();
        return ;
    }
    async verifyImage(file:Express.Multer.File, text='') {
        //return FuncWithTryCatchNew(this, 'verifyImg', file, text)
        return FuncWithTryCatchNew(this, 'verify', file, text);
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
}