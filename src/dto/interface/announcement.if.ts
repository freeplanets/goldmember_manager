import { ANNOUNCEMENT_GROUP, ANNOUNCEMENT_TYPE, SEARCH_GROUP_METHOD } from "../../utils/enum";
import { IModifiedBy } from "./modifyed-by.if";

export interface IAnnouncement {
    id?: string;
    title?: string;
    content?: string;
    type?: ANNOUNCEMENT_TYPE;
    publishDate?: string;
    expiryDate?: string;
    isPublished?: boolean;
    isTop?: boolean;
    iconType: string;
    attachments?: IAttachmemt[];
    targetGroups: [ANNOUNCEMENT_GROUP];
    method?:SEARCH_GROUP_METHOD;
    creator: IModifiedBy;
    updater: IModifiedBy;
    apprevor:IModifiedBy;
}

export interface IAttachmemt {
    name?: string;
    url?: string;
    size?: number;
}

export interface IAnnouncementReadStatus {
    id: string;
    memberId: string;
    readStatus: number; // 0 未讀, 1 已讀
}

export interface IAnnouncementSearch {
    type?: string;
    groups?: IGroupsSearch; 
}
export interface IGroupsSearch {
    group: ANNOUNCEMENT_GROUP[],
    method: SEARCH_GROUP_METHOD;
}
// 未下架和三個月內 
// 預設