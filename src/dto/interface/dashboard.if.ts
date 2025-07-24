import { PendingItemType } from '../../utils/enum';

export interface IPendingITem {
    id:	string; //項目 ID
    type: PendingItemType;   //項目類型 Enum:[ reservation, announcement, coupon ]
    title: string;  //標題
    date: string;   //日期
    status:	string; //狀態
    route?: string;  //路由
}