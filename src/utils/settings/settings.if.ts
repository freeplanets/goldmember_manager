import { ParamTypes } from "./settings.enum";

export interface IScoreLevel {
    min_score: string;  // '0', 最低分數要求
    open_months: string;    //'3', 預約開放月份數
    daily_max_slots: string;    //'2',  每日最大預約時段數
    total_max_slots: string;    // '20', 每月總預約時段數  
}

export interface IScoreObject {
    common?: IScoreLevel;   // 一般等級
    bronze?: IScoreLevel;   // 青銅等級
    silver?: IScoreLevel;   // 銀等級
    gold?: IScoreLevel;  // 金等級  
    platinum?: IScoreLevel; // 白金等級
}

export interface IValueScore {
    app_cancel_hours: number;   // 取消預約前的最小小時數
    shareholder: IScoreObject;  // 股東等級設定
    team: IScoreObject; // 團隊等級設定
    member: IScoreObject; // 成員等級設定
}

export interface INofication {
    notification_hours: string; // '24', 取消預約通知前的最小小時數
}

export interface IAttendance {
    on_time_bonus: string;  //'10', 準時獎勵分數
    late_penalty: string;   //'-10', 遲到懲罰分數
    cancel_penalty: string; //'-15', 取消預約懲罰分數
    no_show_penalty: string;    //'-20', 未出席懲罰分數
}

export interface IGrading {
    initial_score: string;  //'100',   初始分數
    correct_players_bonus: string; //'5', 正確球員獎勵分數
    attendance: IAttendance;
}
export interface ITimeslotSection {
    start_time: string; //'05:00', 開始時間
    number_of_slots: number; //23 時段數量
}

export interface ITimeslots {
    start_month: number;    // 6,   // 開始月份
    start_day: number;  // 1,   // 開始日期
    gap: number;    // 7,   // slot 間隔時間(分鐘）
    sections: ITimeslotSection[]; // 每日時段列表
}

export interface ITimeslotsValue {
    timeslots: ITimeslots[];
}
export interface IParameter<T> {
  id: string;   //ParamTypes;
  key: string;
  value: T;
  // value: IValueScore | INofication | IGrading | ITimeslotsValue;
  description?: string;
}

