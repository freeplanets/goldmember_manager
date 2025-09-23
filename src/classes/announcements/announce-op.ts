import { FilterQuery, Model } from 'mongoose';
import { AnnouncementFilterDto } from '../../dto/announcements/announcement-filter.dto';
import { MainFilters } from '../filters/main-filters';
import { MemberDcoument } from '../../dto/schemas/member.schema';
import { KsMemberDocument } from '../../dto/schemas/ksmember.schema';
import { IOrganization, IReturnObj } from '../../dto/interface/common.if';
import { AnnouncementSearch } from '../../dto/announcements/announcements-search.dto';
import { AnnouncementDocument } from '../../dto/schemas/announcement.schema';
import { IAnnouncement } from '../../dto/interface/announcement.if';
import { DateLocale } from '../common/date-locale';
import { ErrCode } from '../../utils/enumError';
import { ORGANIZATION } from '../../utils/constant';
import { IUser } from '../../dto/interface/user.if';
import { IMember } from '../../dto/interface/member.if';
import { AnnounceFieldsCheck } from '../../dto/announcements/announce-fields-check';
import { Upload2S3 } from '../../utils/upload-2-s3';
import { Attachment } from '../../dto/announcements/attachment';
import { v1 as uuidv1 } from 'uuid';import { AnnouncementData } from '../../dto/announcements/announcement.data';
import { IModifiedBy } from '../../dto/interface/modifyed-by.if';

export class AnnounceOp {
    private myFilter = new MainFilters();
    private myDate = new DateLocale();
    constructor(
        private readonly modelMember:Model<MemberDcoument>,
        private readonly modelKs:Model<KsMemberDocument>,
        private readonly modelAnnouncement:Model<AnnouncementDocument>,
    ) {}
    async getMemberCountByFilter(filters:AnnouncementFilterDto) {
        const rtn:IReturnObj = {};
        const filter = this.myFilter.membersFilter(filters.targetGroups, filters.extendFilter);
        const cnt = await this.modelMember.countDocuments(filter);
        const cntKs = await this.getKsMemberCount(filters);
        console.log('mbr:', cnt, 'ksmbr:', cntKs);
        rtn.data = cnt + cntKs;
        return rtn
    }
    async announcementsGet(announcementSearch: AnnouncementSearch, org=ORGANIZATION) {
        // const rtn:IReturnObj = {};
        let filters = this.myFilter.baseDocFilter<AnnouncementDocument, IAnnouncement>(
            announcementSearch.targetGroups,
            announcementSearch.type,
            announcementSearch.extendFilter,
        );
        // if (filters) {
        console.log('filter:',filters);
        if (!filters) filters = {};
        filters['organization.id'] = org.id;
        const threeMonthsAgo = this.myDate.AddMonthLessOneDay(-3);
        if (!filters.$or) {
            filters.$or = [
                {publishDate: { $gte: threeMonthsAgo }},
                {authorizer: { $exists: false}},
            ];
        } else {
            filters.publishDate = { $gte: threeMonthsAgo };
        }
        console.log('filters:', filters);
        return this.list(filters);
    }
    async list(filters:FilterQuery<AnnouncementDocument>) {
        const rtn:IReturnObj = {}
        const rlt = await this.modelAnnouncement.find(filters);
        if (rlt) {
            rtn.data = (rlt as Partial<IAnnouncement[]>).map((itm) => {
                if (itm.attachments) {
                    itm.attachments = itm.attachments.map((att) => {
                    if (typeof att === 'string') {
                        if (`${att}`.indexOf('"') !== -1) {
                        att = JSON.parse(att);
                        console.log('att:', att);
                        }
                    }
                    return att;
                    });
                }
                return itm;
            });
        } else {
            rtn.error = ErrCode.ANNOUNCEMENT_NOT_FOUND;
        }
        return rtn;        
    }
    async announcementsPost(
        user:Partial<IUser | IMember>,
        announcementCreateDto:Partial<IAnnouncement>,
        files: Array<Express.Multer.File>,
        org = ORGANIZATION
    ){
        const me:any = user;
        const rtn:IReturnObj = {};
        const dtoChk = new AnnounceFieldsCheck(announcementCreateDto);
        if (dtoChk.Error) {
            //comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
            //comRes.error.extra = dtoChk.Error;
            rtn.error = ErrCode.ERROR_PARAMETER;
            rtn.extra = dtoChk.Error;
            return rtn;
        }
        announcementCreateDto = dtoChk.Data;
        console.log('after check:', announcementCreateDto);
        if (files.length > 0 ) {
            //const promises = files.map((file) => this.uploadFile(file))
            const promises = files.map((file) => this.upload(file))
            // const upload = this.uploadFile(file);
            const upload = await Promise.all(promises)
            console.log('upload:', upload);
            //const attachments = files.map((file) => {
            const attachments = [];
            upload.forEach((res) => {
                if (!res) return;
                const attachment:Attachment = {
                name: res.OriginalFilename,
                //url: `https://${this.AWS_S3_BUCKET}/${file.filename}`,
                url: res.fileUrl,
                size: res.filesize, 
                }
                attachments.push(attachment);
            });
            announcementCreateDto.attachments = attachments;
        }
        if (!announcementCreateDto.id) announcementCreateDto.id = uuidv1();
            announcementCreateDto.organization = org;
            announcementCreateDto.creator = {
            modifiedBy: me.id,//user.id,
            modifiedByWho: me.username ? me.username : me.name, //user.username,
            modifiedAt: Date.now(),
        }
        if (announcementCreateDto.isPublished){
            console.log("write check");
            announcementCreateDto.publishedTs = Date.now();
        }
        const rlt = await this.modelAnnouncement.create(announcementCreateDto);
        console.log('announcementsPost', rlt);
        if (rlt) {
            console.log('announcementsPost pass true check');       
        }
        rtn.data = rlt;
        return rtn;  
    }
    async announcementsIdGet(id: string) {
        const rtn:IReturnObj = {};
        const rlt = await this.modelAnnouncement.findOne({id});
        if (rlt) {
            if (rlt.attachments) {
                rlt.attachments = rlt.attachments.map((att) => {
                    if (typeof att === 'string') {
                        if (`${att}`.indexOf('"') !== -1) {
                            att = JSON.parse(att);
                            console.log('att:', att);
                        }
                    }
                    return att;
                });
            }
            rtn.data = rlt as AnnouncementData;
        }
        return rtn;
    }
    async announcementsIdPut(
        user:Partial<IUser|IMember>,
        id: string,
        announceUpdateDto: Partial<IAnnouncement>,
        files:Express.Multer.File[],
        org=ORGANIZATION
    ) {
        const rtn:IReturnObj = {};
        const dtoChk = new AnnounceFieldsCheck(announceUpdateDto);
        if (dtoChk.Error) {
            rtn.error= ErrCode.ERROR_PARAMETER;
            rtn.extra = dtoChk.Error;
            return rtn;
        }
        console.log('after fields check:', dtoChk.Data);
        announceUpdateDto = dtoChk.Data;
        if (files.length > 0 ) {
            const promises = files.map((file) =>  this.upload(file));
            console.log("files", files);
            // const upload = this.uploadFile(file);
            const upload = await Promise.all(promises)
            console.log('upload:', upload);
            if (!announceUpdateDto.attachments) announceUpdateDto.attachments = [];
            upload.forEach((file) => {
            if (!file) return;
            console.log("file name:", file.OriginalFilename);
            const attachment:Attachment = {
                name: file.OriginalFilename,
                url: file.fileUrl, //`https://${this.AWS_S3_BUCKET}/${file.originalname}`,
                size: file.filesize, 
            }
            const f = announceUpdateDto.attachments.find((itm) => itm.name === attachment.name);
            if (!f) announceUpdateDto.attachments.push(attachment);
            });
        } else {
            announceUpdateDto.attachments = [];
        }
        const me:any = user;
        announceUpdateDto.updater = {
            modifiedBy: me.id,
            modifiedByWho: me.username ? me.username : me.name,
            modifiedAt: Date.now(),
        }
        if (announceUpdateDto.isPublished){
            console.log("update publish check");
            announceUpdateDto.publishedTs = Date.now();
        }
        const filter:FilterQuery<AnnouncementDocument> = {
            id,
        };
        if (org && org.id) {
            filter['organization.id'] = org.id;
        }
        const rlt = await this.modelAnnouncement.updateOne(filter, announceUpdateDto);
        console.log('announcementsPost', rlt);
        if (rlt) {
            console.log('announcementsPost pass true check');       
        }
        rtn.data = id;
        return rtn;
    }
    async delete(id:string, org:IOrganization) {
        const rtn:IReturnObj={};
        const filter:FilterQuery<AnnouncementDocument> ={
            id,
            'organization.id' : org.id,
        }
        const del = await this.modelAnnouncement.deleteOne(filter);
        if (del.deletedCount> 0) {
            rtn.data = id;
        } else {
            rtn.error = ErrCode.DATABASE_ACCESS_ERROR;
        }
        return rtn;
    }
    async announcementsIdPublish(id: string, user:Partial<IUser|IMember>) {
        const rtn:IReturnObj = {};
        const ann = await this.modelAnnouncement.findOne(
            {id, authorizer: { $exists: false}}, 
            'publishDate expiryDate isPublished targetGroups method');
        if (ann) {
            const me:any = user;            
            const authorizer:IModifiedBy = {
                modifiedBy: me.id,
                modifiedByWho: me.username ? me.username : me.name,
                modifiedAt: Date.now(),
                lastValue: ann.isPublished,
            }
            const pDate = new Date(ann.publishDate);
            const updateData:Partial<IAnnouncement> = {
                isPublished: true,
                authorizer,
                publishedTs:pDate.getTime() > Date.now() ? pDate.getTime() :  Date.now()
            };
            const isModified = await this.modelAnnouncement.updateOne(
                {id}, 
                updateData,
            );
            console.log("announcementsIdPublish isModified:", isModified);
            if (!isModified.modifiedCount) {
                console.log("announcementsIdPublish isModified show false");
                rtn.error = ErrCode.ANNOUNCE_PUBLISH_ERROR;
            }
        } else {
            rtn.error = ErrCode.ITEM_NOT_FOUND;
        }
        return rtn;
    }
    async announcementsIdUnpublish(id: string, user:Partial<IUser|IMember>) {
        const rtn:IReturnObj={};
        const ann = await this.modelAnnouncement.findOne({id}, 'isPublished');
        if (ann) {
            const me:any = user;
            if (ann.isPublished || typeof (ann.isPublished) === 'undefined') {
            const authorizer:IModifiedBy = {
                modifiedBy: me.id,
                modifiedByWho: me.username ? me.username : me.name, //user.username,
                modifiedAt: Date.now(),
                lastValue: ann.isPublished,
            }
            const updateData:Partial<IAnnouncement> = {
                isPublished: false,
                authorizer,
                publishedTs: 0,
            };
            const upd = await this.modelAnnouncement.updateOne(
                {id}, 
                updateData,
            );
            console.log("announcementsIdUnpublish upd:", upd);
            if (!upd.modifiedCount) {
                rtn.error = ErrCode.ANNOUNCE_PUBLISH_ERROR;
            }
            }
        } else {
            rtn.error = ErrCode.ITEM_NOT_FOUND;
        }
        return rtn;
    }        
    async upload(file:Express.Multer.File) {
        const upload2S3 = new Upload2S3();
        const upload = await upload2S3.uploadFile(file);
        console.log('after upload:', upload);
        if (upload) {
            //return  `${this.Upload2S3.S3_BUCKET_URL}/${file.originalname}`;
            return upload2S3.Response;
        }
        return false;
    }    
    private async getKsMemberCount(filters:AnnouncementFilterDto) {
        const filter = this.myFilter.KsMemberFilter(filters.targetGroups, filters.extendFilter);
        console.log('filter:', filter);
        const cnt = Object.keys(filter).length;
        if (cnt > 0) {
            const ans = await this.modelKs.countDocuments(filter);
            return ans;
        }
        return 0;
    }
}