import { DS_LEVEL, GENDER, MEMBER_LEVEL } from "../../utils/enum";
import { ILoginDevice } from "./devices.if";
import { IModifiedBy } from "./modifyed-by.if";

export interface IMember {
  id?: string;
  systemId?: string;
  name?: string;
  displayName?: string;
  password?: string;
  passwordLastModifiedTs: number;
  passwordUpdateReminderDays?: number; // 密碼更新提醒天數
  gender?: GENDER;
  birthDate?: string;
  birthMonth?: number;
  email?: string;
  phone?: string;
  address?: string;
  handicap: number;
  pic?: string,  // 圖片(會員上傳或預設圖片自選)
  membershipType?: MEMBER_LEVEL;  // 
  membershipLastModified?: IModifiedBy;
  mobileType: string; //手機種類
  mobileId: string; //app 安裝序號, 每次重裝會不同
  joinDate?: string;
  expiryDate?: string;
  notes?: string;
  lastLogin: number;
  lastLoginIp: string;
  isDirector?: boolean;       // 球場董監事
  refSystemId?: string;  //非股東會員董監代表之股東代號
  directorStatusLastModified?: IModifiedBy;
  isLocked?: boolean; // 是否鎖定
  passwordFailedCount?: number
  passwordLastTryTs?: number;
  announcementReadTs?: number; // 公告已讀時間戳
  devices: Partial<ILoginDevice>[]; //會員登入設備
  isCouponTriggered: boolean; // 因轉送優惠券而產生的會員
  isNotAppMember?: boolean; // 是否非app會員 only use for search Ks Member
}

export interface IMemberActivity {
  year:number;
  month:number;
  memberId:string;
  membershipType:MEMBER_LEVEL;
  lastLogin:number;
}

export interface IMemberTransferLog extends IModifiedBy {
  id:string;
  memberId:string;
  memberName:string;
  oldMembershipType?: MEMBER_LEVEL;
  newMembershipType?: MEMBER_LEVEL;
  isDirector?: boolean;
}
// 非app股東，查詢優惠券

// 查詢 股號，手機，名字(含國興資料)

// 股東會員邀請碼

// 特別會員無券使用優惠券-產生即用券
// QRCode 新增會員，QRCode包倉內容 (股東會員邀請碼...)