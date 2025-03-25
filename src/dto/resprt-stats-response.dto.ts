import { IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatsData } from './data/report-stats.data';

export class ReportStatsResponseDto extends ReportStatsData {
}
