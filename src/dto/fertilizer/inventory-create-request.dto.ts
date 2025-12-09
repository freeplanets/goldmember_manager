import { ApiProperty } from '@nestjs/swagger';
import { IInventory } from '../interface/fertilizer.if';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InventoryCreateReqDto implements Partial<IInventory> {
    @ApiProperty({
        description: '品名',
    })
    @IsString()
    name: string;   //品名

    @ApiProperty({
        description: '單位',
    })
    @IsString()
    unit: string;   //單位

    @ApiProperty({
        description: '產品編號',
        required: false,
    })
    @IsOptional()
    @IsString()
    product_code: string; //產品編號

    @ApiProperty({
        description: '($uuid)分類 ID',
    })
    @IsString()
    category_id: string;    //($uuid)分類 ID


    @ApiProperty({
        description: '警示存量',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    alert_quantity:	number; //警示存量

    @ApiProperty({
        description: '單價',
        required: false,
    })
    unit_price:	number; //單價

    @ApiProperty({
        description: '備註',
        required: false,
    })
    @IsOptional()
    @IsString()
    notes: string; //備註
}