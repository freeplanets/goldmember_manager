import { ApiProperty } from "@nestjs/swagger";
import { IStockSummary } from "../interface/fertilizer.if";

export class StockSummaryDta implements IStockSummary {
    @ApiProperty({
        description: '商品 ID',
    })
    id:	string; //($uuid)商品 ID

    @ApiProperty({
        description: '品名',
    })
    name?: string;   //品名

    @ApiProperty({
        description: '單位',
    })
    unit?: string;   //單位

    @ApiProperty({
        description: '產品編號',
    })
    product_code?: string;   //產品編號

    @ApiProperty({
        description: '分類名稱',
    })
    category_name?: string;  //分類名稱

    @ApiProperty({
        description: '進貨總量',
    })
    total_in: number;   //進貨總量

    @ApiProperty({
        description: '出貨總量',
    })
    total_out: number;  //出貨總量

    @ApiProperty({
        description: '庫存（進貨總量 - 出貨總量）',
    })
    stock: number;  //庫存（進貨總量 - 出貨總量）

    @ApiProperty({
        description: '警示存量',
    })
    alert_quantity?:	number; //警示存量

    @ApiProperty({
        description: '備註',
    })
    notes?: string;  //備註     
}