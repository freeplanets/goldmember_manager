import { ICommonLog } from "./common.if";

export interface IInventoryCategory {
    id: string;
    name: string;
    logs?: ICommonLog[];
}

export interface IInventory {
    id:	string; //($uuid)
    name: string;   //品名
    unit: string;   //單位
    product_code: string; //產品編號
    category_id: string;    //($uuid)分類 ID
    category_name?: string;  //分類名稱
    alert_quantity:	number; //警示存量
    unit_price:	number; //單價
    notes: string; //備註
    logs?: ICommonLog[];
}

//入出庫
export interface IStockInOut {
    id:	string; //($uuid)
    date: string;   //($date)進貨日期
    product_id:	string; //($uuid)
    product_name?: string;   //
    product_unit?: string;   //
    category_id?: string;
    category_name?: string;  //
    quantity: number;   //數量
    method: string; // 購買、領貨、退回、其他
    calMark: 1 | -1;
    creator: string;    //建立者
    handler: string;    //經辦人
    notes: string;  //備註    
}

//入出庫統計
export interface IStockSummary {
    id:	string; //($uuid)商品 ID
    name?: string;   //品名
    unit?: string;   //單位
    product_code?: string;   //產品編號
    category_name?: string;  //分類名稱
    total_in: number;   //進貨總量
    total_out: number;  //出貨總量
    stock: number;  //庫存（進貨總量 - 出貨總量）
    alert_quantity?:	number; //警示存量
    notes?: string;  //備註 
}
export interface IInOutMark {
    Title: string,
    CalMark: 1 | -1;
}
export interface IStockInOutMark {
    [key:string]:IInOutMark
}