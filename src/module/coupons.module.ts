import { Module } from '@nestjs/common';
import { CouponsController } from '../controller/coupons.controller';
import { CouponsService } from '../service/coupons.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponBatch, CouponBatchSchema } from '../dto/schemas/coupon-batch.schema';
import { Coupon, CouponSchema } from '../dto/schemas/coupon.schema';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { KsMember, KsMemberSchema } from '../dto/schemas/ksmember.schema';
import { Member, MemberSchema } from '../dto/schemas/member.schema';
import { CouponStats, CouponStatsSchema } from '../dto/schemas/coupon-stats.schema';
import { CouponAutoIssuedLog, CouponAutoIssuedLogSchema } from '../dto/schemas/coupon-auto-issued-log.schema';
import { CouponTransferLog, CouponTransferLogSchema } from '../dto/schemas/coupon-transfer-log.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: CouponBatch.name, schema: CouponBatchSchema },
      { name: Coupon.name, schema: CouponSchema},
      { name: LoginToken.name, schema: LoginTokenSchema },
      { name: Member.name, schema: MemberSchema },
      { name: CouponStats.name, schema: CouponStatsSchema},
      { name: KsMember.name, schema: KsMemberSchema},
      { name: CouponAutoIssuedLog.name, schema: CouponAutoIssuedLogSchema},
      { name: CouponTransferLog.name, schema: CouponTransferLogSchema },
    ]),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
