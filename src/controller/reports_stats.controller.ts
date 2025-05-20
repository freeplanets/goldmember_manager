import { Controller, Req, Res, HttpStatus, Get, Query, UseGuards, Delete, Param } from '@nestjs/common';
import { ReportsStatsService } from '../service/reports_stats.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ReportStatsResponseDto } from '../dto/resprt-stats-response.dto';
import { TokenGuard } from '../utils/tokens/token-guard';

@Controller('reports')
@ApiTags('reports')
@ApiBearerAuth()
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
  @UseGuards(TokenGuard)
  @Get('/stats')
  async reportsStats(
    @Query('year') year: string,

    // @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('typeof year:', typeof(year));
    const rsRes = await this.reportsStatsService.reportsStats(year);
    return res.status(HttpStatus.OK).json(rsRes);
  }

  @ApiExcludeEndpoint(true)
  @Get('/recal/:year')
  async recal(@Param('year') year: string, @Res() res:Response) {
    console.log('recal');
    const comRes = await this.reportsStatsService.recal(year);
    return res.status(HttpStatus.OK).json(comRes);
  }
}
