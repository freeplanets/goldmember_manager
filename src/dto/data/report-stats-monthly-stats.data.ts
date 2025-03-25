import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMemberMonthly } from '../interface/report.if';

export class ReportStatsMonthlyStatsData implements IMemberMonthly {
  @ApiProperty({
    description: '月份',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  month?: number;

  @ApiProperty({
    description: '新會員',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  newMembers?: number;

  @ApiProperty({
    description: '已使用優惠券',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  usedCoupons?: number;

  @ApiProperty({
    description: '優惠券年度使用率',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  yearToDateUsageRate?: number;
}
