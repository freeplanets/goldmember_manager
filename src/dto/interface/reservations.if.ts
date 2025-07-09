// 預約
// 預約時段提前3個月開放預約.
// 每人預約組數限制
// 團體預約功能,團體預約者需主動確認預約所有事項,預約取消時需提前兩週.
// 團體預約時段修改->取消原預約,重新預約新時段.
// 團體預約時段->大比賽預約時間區間（日期、時段）,不產生時段(time slot)表.
// 團體預約時段->小比賽時段,產生時段(time slot)表.
// 團體預約選項->球區、時段、組數、人數.
// 預約控制方式->總組數。
// 預約時段設定,預先產生預約時段表.
// 預約時段保留設定
// 預約時段並組功能(每組不足4人時),由現場人員處理.
// 預約人員名稱(optional)
// 球隊預約多時段功能
// app和非app會員確認方式(由後台人員登錄確認)
// app可取消預約，需要確認。
// 後台人員自設保留時段.
// 日期，可預約時段。
// 預約修改-> 球隊info（預先取得全球隊資訊） -> 不在球隊新增 -> 新增球隊連絡人(來電者) -> 不明人數時改為保留時段
// dashboard -> 筆數,
// 會員，球隊評分欄位
import { CourseName, MEMBER_LEVEL, ParticipantStatus, ReserveFrom, ReserveStatus, ReserveType, TimeSectionType } from '../../utils/enum';

//預約時段資料
export interface IReserveSection {
    date:string;    //($date)日期 (YYYY/MM/DD)
    timeSlot:string;    //時段 (HH:MM)
    startTime:string;   //開始時間 (HH:MM)
    endTime:string; //結束時間 (HH:MM)
    course:CourseName;  //球道 Enum:[ west, east, south ]
    courses:CourseName[];    // 球道列表 (時間範圍預約時使用)
    type:TimeSectionType;    //時段類型 (單一時段或時間範圍) Enum:[ timeslot, range ]
}

//預約歷史記錄
export interface IReserveHistory {
    date:string;    //($date)日期
    time:string;    //時間
    id:string;  //操作人員ID
    name:string;    //操作人員
    action:string;  //操作內容
    reason?:string;  //變更理由
}

export interface IReservationParticipant {
    member:string;
    // from Member
    id:	string; //參與者 ID
    name: string;   //參與者姓名
    phone: string;  //參與者電話
    membershipType:	string; //會員類型
    // from Member ---end
    registrationDate: string;   //($date)報名日期
    status:	ParticipantStatus; //報名狀態 Enum: [ confirmed, pending, cancelled ]  
}

export interface IReservations {
    id:string;  //預約 ID
    type:ReserveType;    //預約類型 (球隊或個人)Enum:[ team, individual ]
    teamId:string;  //球隊 ID (球隊預約時使用)
    teamName:string;    //球隊名稱 (球隊預約時使用)
    contactPerson:string;   //聯絡人姓名
    contactPhone:string;    //聯絡人電話
    memberId:string;    //會員 ID (個人預約時使用)
    memberName:string;  //會員姓名 (個人預約時使用)
    memberPhone:string; //會員電話 (個人預約時使用)
    membershipType:MEMBER_LEVEL;  //會員類型 (個人預約時使用)Enum:[ general_member, dependents, share_holder ]
    playerCount:number; //參與人數 (個人預約時使用)
    participants:string | IReservationParticipant[];    //參與人員名單 (個人預約時使用)
    groups:number;  //組數
    data:IReserveSection[];   //預約時段資料
    notes:string;   //備註
    status:ReserveStatus;  //預約狀態 Enum:[ pending, booked, confirmed, cancelled ]
    createdAt:string;   //($date-time)建立時間
    reservedFrom:ReserveFrom;    //預約來源 Enum:[ app, backend ]
    history:IReserveHistory[];
}