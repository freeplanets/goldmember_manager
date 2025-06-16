import { ANNOUNCEMENT_READ_STATUS } from '../../utils/enum';
import { IHasFilterItem } from './common.if';
import { IModifiedBy } from './modifyed-by.if';

export interface IAnnouncement extends IHasFilterItem {
    id?: string;
    title?: string;
    content?: string;
    publishDate?: string;
    expiryDate?: string;
    isPublished?: boolean;
    isTop?: boolean;
    iconType?: string;
    attachments?: IAttachmemt[];
    birthMonth: number,
    creator: IModifiedBy;
    updater: IModifiedBy;
    // isApproved: boolean;
    authorizer:IModifiedBy;
    publishedTs:number;
}

export interface IAttachmemt {
    name?: string;
    url?: string;
    size?: number;
}

export interface IAnnouncement2Member {
    id:string;
    memberId: string;
    announcementId:string;
    publishDate?: string;
    expiryDate?: string;
    readStatus: ANNOUNCEMENT_READ_STATUS; // 0 未讀, 1 已讀
    isDeleted: boolean;
    isPublished: boolean
}

// 未下架和三個月內 
// 預設