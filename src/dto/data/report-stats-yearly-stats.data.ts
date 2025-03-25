import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMemberYearly } from '../interface/report.if';

export class ReportStatsYearlyStatsData implements IMemberYearly {
  @ApiProperty({
    description: '總會員數',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalMembers?: number;

  @ApiProperty({
    description: '新入會',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  newMembers?: number;

  @ApiProperty({
    description: '優惠券發行總數',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalCoupons?: number;

  @ApiProperty({
    description: '已使用',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  usedCoupons?: number;

  @ApiProperty({
    description: '使用率',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  usageRate?: number;
}
