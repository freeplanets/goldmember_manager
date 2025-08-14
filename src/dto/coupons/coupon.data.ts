import { IsOptional, IsString, IsObject, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICoupon, ICouponTransferLog } from '../interface/coupon.if';
import { IModifiedBy } from '../interface/modifyed-by.if';
import { ModifiedByData } from '../data/modified-by.data';
import { CouponRequestDto } from './coupon-request.dto';

export class CouponData extends CouponRequestDto implements ICoupon {
  @ApiProperty({
    description: '編號',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: '名稱',
    required: false,
  })
  name: string;
  @ApiProperty({
    description: '類型',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: '國興優惠代碼'
  })
  @IsOptional()
  @IsString()
  mode?: string;

  @ApiProperty({
    description: '發行日期',
    required: false,
  })
  @IsOptional()
  @IsString()
  issueDate?: string;

  @ApiProperty({
    description: '使用日期',
    required: false,
  })
  @IsOptional()
  @IsString()
  usedDate?: string;

  @ApiProperty({
    description: '優惠說明',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '原始持有者',
    required: false,
  })
  @IsOptional()
  @IsString()
  originalOwner: string;

  @ApiProperty({
    description: '轉為紙本(號碼)',
    required: false
  })
  @IsOptional()
  @IsString()
  toPaperNo: string;

  @ApiProperty({
    description:'轉為紙本(號碼)時間戳',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  toPaperTS: number;

  @ApiProperty({
    description: '修改人',
    type: ModifiedByData,
    required: false,
  })
  @IsOptional()
  @IsObject()
  updater: IModifiedBy;

  @ApiProperty({
    description: '櫃枱收券人',
    type: ModifiedByData,
    required: false,
  })
  @IsOptional()
  @IsObject()
  collector: IModifiedBy;

  @ApiProperty({
    description: '異動記錄',
  })
  logs: Partial<ICouponTransferLog>[];
}
