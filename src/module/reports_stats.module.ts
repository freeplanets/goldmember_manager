import { Module } from '@nestjs/common';
import { ReportsStatsController } from '../controller/reports_stats.controller';
import { ReportsStatsService } from '../service/reports_stats.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberYearly, MemberYearlySchema } from '../dto/schemas/member-yearly.schema';
import { MemberMonthly, MemberMonthlySchema } from '../dto/schemas/member-monthly.schema';
import { MemberGrowth, MemberGrowthSchema } from '../dto/schemas/member-growth.schema';
import { CouponStats, CouponStatsSchema } from '../dto/schemas/coupon-stats.schema';
import { Member, MemberSchema } from '../dto/schemas/member.schema';
import { Coupon, CouponSchema } from '../dto/schemas/coupon.schema';
import { MemberActivity, MemberActivitySchema } from '../dto/schemas/member-activity.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {name:LoginToken.name, schema:LoginTokenSchema},
      {name:MemberYearly.name, schema:MemberYearlySchema},
      {name:MemberMonthly.name, schema:MemberMonthlySchema},
      {name:MemberGrowth.name, schema:MemberGrowthSchema},
      {name:CouponStats.name, schema:CouponStatsSchema},
      {name:Member.name, schema:MemberSchema},
      {name:Coupon.name, schema:CouponSchema},
      {name:MemberActivity.name, schema:MemberActivitySchema},
    ]),
  ],
  controllers: [ReportsStatsController],
  providers: [ReportsStatsService],
})
export class ReportsStatsModule {}
