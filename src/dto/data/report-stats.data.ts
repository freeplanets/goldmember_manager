import { IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatsYearlyStatsData } from './report-stats-yearly-stats.data';
import { ReportStatsMonthlyStatsData } from './report-stats-monthly-stats.data';
import { ReportStatsGrowthStatsData } from './report-stats-growth-stats.data';
import { ReportStatsCouponStatsData } from './report-stats-coupon-stats.data';
import { ICouponStats, IMemberGrowth, IMemberMonthly, IReport } from '../interface/report.if';

export class ReportStatsData implements IReport {
  @ApiProperty({
    description: '年度統計',
    // example: new ReportStatsYearlyStatsData(),
  })
  @IsObject()
  yearlyStats: ReportStatsYearlyStatsData = new ReportStatsYearlyStatsData();

  @ApiProperty({
    description: '月統計',
    isArray: true,
    type: ReportStatsMonthlyStatsData,
    // example: [new ReportStatsMonthlyStatsData()],
  })
  @IsArray()
  monthlyStats: IMemberMonthly[];

  @ApiProperty({
    description: '會員成長統計',
    isArray: true,
    type: ReportStatsGrowthStatsData
    //example: [new ReportStatsGrowthStatsData()],
  })
  @IsArray()
  growthStats: IMemberGrowth[];

  @ApiProperty({
    description: '優惠券統計',
    isArray: true,
    type: ReportStatsCouponStatsData
    //example: [new ReportStatsCouponStatsData()],
  })
  @IsArray()
  couponStats: ICouponStats[];
}
