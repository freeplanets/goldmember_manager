import { ApiProperty } from '@nestjs/swagger';
import { IStockInOut } from '../interface/fertilizer.if';
import { IsNumber, IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';
import { DateLocale } from '../../classes/common/date-locale';

const myDate = new DateLocale();

export class StockInOutReqDto implements Partial<IStockInOut> {
    @ApiProperty({
        description: '進(出)貨日期',
        example: myDate.toDateString(),
    })
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    date: string;   //($date)進貨日期

    @ApiProperty({
        description: '產品ID(uuid)'
    })
    @IsString()
    @IsUUID()
    product_id:	string; //($uuid)

    @ApiProperty({
        description: '數量',
    })
    @IsNumber()
    quantity: number;   //數量

    @ApiProperty({
        description: '購買、領貨、退回、其他',
        required: false,
    })
    @IsOptional()
    @IsString()
    method: string; // 購買、領貨、退回、其他

    @ApiProperty({
        description: '經手人',
    })
    @IsString()
    handler: string;

    @ApiProperty({
        description: '備註',
        required: false,
    })
    @IsOptional()
    @IsString()
    notes: string;  //備註  
}