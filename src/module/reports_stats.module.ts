import { Module } from '@nestjs/common';
import { ReportsStatsController } from '../controller/reports_stats.controller';
import { ReportsStatsService } from '../service/reports_stats.service';

@Module({
  imports: [],
  controllers: [ReportsStatsController],
  providers: [ReportsStatsService],
})
export class ReportsStatsModule {}
