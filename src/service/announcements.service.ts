import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE, SEARCH_GROUP_METHOD } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { AnnouncementSearch } from '../dto/announcements/announcements-search.dto';
import { AnnouncementCreateDto } from '../dto/announcements/announcement-create.dto';
import { FilterQuery, Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from '../dto/schemas/announcement.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from "aws-sdk";
import { Readable } from 'stream';
import { Attachment } from '../dto/announcements/attachment';
import { IAnnouncement } from '../dto/interface/announcement.if';
import { v1 as uuidv1 } from 'uuid';


@Injectable()
export class AnnouncementsService {
  AWS_S3_BUCKET = 'images.uuss.net/linkougolf/';
  s3 = new AWS.S3({
    region: 'ap-southeast-1'
  });
  constructor(
    @InjectModel(Announcement.name) private readonly modelAnnouncement:Model<AnnouncementDocument>
  ){}
  async announcementsGet(
    announcementSearch: AnnouncementSearch
  ): Promise<any> {
    try {
      const filters:FilterQuery<AnnouncementDocument> = {}
      if (announcementSearch.type) filters.type = announcementSearch.type;
      if (announcementSearch.groups) {
        if (announcementSearch.groups.method === SEARCH_GROUP_METHOD.INTERSECTION) {

        } else {
          filters.targetGroups = { $in: [...announcementSearch.groups.group]}
        }
      }
      return await this.modelAnnouncement.find(filters);
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async announcementsPost(
    announcementCreateDto:Partial<IAnnouncement>,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const upload = this.uploadFile(file);
      console.log('upload:', upload);
      if (upload) {
        const attachment:Attachment = {
          name: file.originalname,
          url: this.AWS_S3_BUCKET,
          size: file.size, 
        }
        if (!announcementCreateDto.id) announcementCreateDto.id = uuidv1();
        announcementCreateDto.attachments = [ attachment ];
        return await this.modelAnnouncement.create(announcementCreateDto);
      } else {
        return false;
      }
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  announcementsIdGet(id: string, req: Request): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  announcementsIdPut(
    id: string,
    announcementUpdateDto: AnnouncementCreateDto,
    req: Request,
  ): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  announcementsIdPublish(id: string, req: Request): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  announcementsIdUnpublish(id: string, req: Request): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        resolve({});
      });
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async uploadFile(file:Express.Multer.File) {
    console.log('file:', file);
    const { originalname } = file;
    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype
     )
  }

  async s3_upload(fileBuffer:Buffer|Uint8Array|Blob|string|Readable, bucket:string, name:string, mimetype:string) {
    const params:AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: fileBuffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };
    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch(err) {
      console.log("S3 Upload Error:", err);
      return false;
    }
  }
}
