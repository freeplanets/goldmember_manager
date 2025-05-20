import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICouponStats } from '../interface/report.if';

export class ReportStatsCouponStatsData implements ICouponStats {
  @ApiProperty({
    description: '優惠券種類',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: '電子票券',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  electronicCount?: number;

  @ApiProperty({
    description: '電子票券-已使用',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  electronicUsed?: number;

  @ApiProperty({
    description: '電子票券-已失效',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  electronicInvalid?: number;

  @ApiProperty({
    description: '電子票券-已過期',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  electronicExpired?: number;

  @ApiProperty({
    description: '電子票券-未使用',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  electronicUnused?: number;

  @ApiProperty({
    description: '紙本券',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paperCount?: number;

  @ApiProperty({
    description: '紙本券-已使用',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paperUsed?: number;

  @ApiProperty({
    description: '紙本券-已失效',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paperInvalid?: number;

  @ApiProperty({
    description: '紙本券-已過期',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paperExpired?: number;

  @ApiProperty({
    description: '紙本券-未使用',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paperUnused?: number;
}
