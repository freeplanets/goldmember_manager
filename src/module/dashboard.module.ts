import { Module } from '@nestjs/common';
import { DashboardController } from '../controller/dashboard.controller';
import { DashboardService } from '../service/dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservations, ReservationsSchema } from '../dto/schemas/reservations.schema';
import { Announcement, AnnouncementSchema } from '../dto/schemas/announcement.schema';
import { CouponBatch, CouponBatchSchema } from '../dto/schemas/coupon-batch.schema';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            { name: Reservations.name, schema: ReservationsSchema },
            { name: Announcement.name, schema: AnnouncementSchema },
            { name: CouponBatch.name, schema: CouponBatchSchema },
            { name: LoginToken.name, schema: LoginTokenSchema },
        ])
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}