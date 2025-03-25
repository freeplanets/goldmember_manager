import { Controller, Req, Res, HttpStatus, Get, Query } from '@nestjs/common';
import { ReportsStatsService } from '../service/reports_stats.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportStatsResponseDto } from '../dto/resprt-stats-response.dto';

@Controller('reports')
@ApiTags('reports')
export class ReportsStatsController {
  constructor(private readonly reportsStatsService: ReportsStatsService) {}

  @ApiOperation({
    summary: '取得統計報表資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: ReportStatsResponseDto,
  })
  @Get('/stats')
  async reportsStats(
    @Query('year') year: number,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.reportsStatsService.reportsStats(year, req);

    return res.status(HttpStatus.OK).json(new ReportStatsResponseDto());
  }
}
