import { Module } from '@nestjs/common';
import { CouponsController } from '../controller/coupons.controller';
import { CouponsService } from '../service/coupons.service';

@Module({
  imports: [],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
