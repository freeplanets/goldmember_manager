// 球隊&團體
// 這個檔案定義了球隊和團體的接口
// 成立方式：
// 1. 球隊：由一群人組成，通常是參加比賽的團體。
// 2. 團體：可以是任何形式的組織，如俱樂部、協會等。
// 3. 其他：可以是任何其他形式的組織。
// 成立流程：
// 1. 球隊或團體：需要有一個隊長或管理者申請成立，並提供相關信息並經審核通過後成立。
// 2. 成員加入方式：可以通過邀請(發送邀請碼)或申請加入，經管理者審核通過後成為成員。
// 3. 成員退出方式：可以通過申請退出，經管理者審核通過後退出團體。
// 成員管理：
// 1. 管理者可以添加或移除成員。
// 2. 提供QRCode邀請碼，成員可以通過掃描加入團體。
// 3. 管理者可以設置成員的權限或職務，如是否可以發起活動。
// 4. 成員可以查看團體信息、成員列表等。
// 5. 可以參加團體活動、討論(投票功能?)等。
// 6. 佈告欄功能：可以發布團體公告、活動信息等。
// 團體預約功能
// 1. 團體可以進行預約，預約時需要提供團體信息、預約時間等,由成員報名參加,預約時提供名單。
// 2. 目前由總幹事電話預約.

import { COLLECTION_REF, MEMBER_LEVEL, TeamActivityRegistrationStatus, TeamActivityStatus, TeamMemberPosition, TeamMemberStatus, TeamStatus } from '../../utils/enum';
import { IHasPhone } from './common.if';
import { IModifiedBy } from './modifyed-by.if';

export interface ITeamPositionInfo extends IHasPhone {
    id?:string;  //會員 ID
    name: string; // 姓名
    phone: string; // 電話
}

export interface IActivityParticipants {
    actId: string;  // 活動代號
    member: string; // ITeamMember object id;
    registrationDate: string;
    status: TeamActivityRegistrationStatus,
}

export interface ITeamMember {
    teamId?: string;    //球隊ID
    //member?: string | Partial<IMember>; //會員 object Id
    // from member table
    memberInfo: string;
    memberFrom?: COLLECTION_REF;  // 參照 Member or KsMember
    //id?:	string; // 會員 ID
    // name?: string; // 會員姓名
    phone?: string; // 電話
    // membershipType?: MEMBER_LEVEL; //會員類型
    //systemId?: string;   // 國興ID
    handicap?: number;  // for first time
    // from member table -- end
    role?: TeamMemberPosition; // 角色
    joinDate?: string; //加入日期
    isActive?: boolean; //是否活躍
    // data from member table
    status: TeamMemberStatus;
    _id?:string; 
}

export interface IActMemberInfo  {
    // id: string;
    id:	string; // 會員 ID
    name: string; // 會員姓名
    phone?: string; // 電話
    membershipType?: MEMBER_LEVEL; //會員類型
    systemId?: string;   // 國興ID
    registrationDate: string;
    status: TeamActivityRegistrationStatus;
}

export interface ICreditRecord {
    //teamObjId?:string; //球隊ID
    id: string; //記錄 ID
    refId: string; // 參考 ID, 如球隊 ID, 會員 ID 等
    date: string;   //日期
    score: number; //評分
    reason: string; //原因
    recordedBy:	IModifiedBy; //記錄人員
}

export interface ITeamAnnouncement {
    //teamObjId?: string; //球隊ID
    id: string; // 公告 ID
    title: string; //標題
    content: string; // 內容
    publishDate: string; // 發布日期
    isImportant: boolean; //是否重要
    author:	string; //作者
}

export interface ITeamActivity {
    id: string; //活動 ID
    teamId?: string; //球隊ID
    title: string; //標題
    description: string; //描述
    date:string;    //日期
    location: string;   //地點
    registrationStart: string;  // 報名開始日期
    registrationEnd: string;    //報名結束日期
    //participants: IActivityParticipants[];  //number;   // 參與人數
    participants: ITeamMember[];
    maxParticipants: number; //最大參與人數
    status:	TeamActivityStatus; //狀態
    creator: IModifiedBy; //發起人
    updater: IModifiedBy; //修改人 
}

export interface ITeam {
    id: string; //球隊 ID
    name: string;   //球隊名稱
    status:	TeamStatus; //球隊狀態
    creditScore: number;    //信用評分
    logoUrl: string;    //球隊 Logo URL
    description: string;    //球隊描述
    //leader?: ITeamPositionInfo;  // 隊長
    //manager?: ITeamPositionInfo; // 經理
    contacter?: ITeamPositionInfo;   //連絡人
    lastActivity: string; //最近活動日期
    members?: ITeamMember[]; // 隊員清單
    creditHistory?: ICreditRecord[]; //評分記錄
    announcements?: ITeamAnnouncement[]; // 公告
    activities?: ITeamActivity[];    // 活動
}

export interface IBehavioralScore {
    refId: string; // 參考 ID, 如球隊 ID, 會員 ID 等
    scoreChange: number; // 分數變化
    newScore: number; // 新分數
    reason: string; // 變化原因
    date: string; // 變化日期
}
