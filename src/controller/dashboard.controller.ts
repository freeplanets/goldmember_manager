import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from '../utils/tokens/token-guard';
import { DashboardService } from '../service/dashboard.service';
import { Response } from 'express';
import { PendingAllResponse } from '../dto/dashboard/pending-all.response';

@Controller('dashboard')
@ApiTags('dashboard')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private readonly dbService:DashboardService) {}
    @ApiOperation({
        summary: '取得待處理事項列表',
        description: '取得所有待處理事項的列表',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: PendingAllResponse,
    })
    @Get('pending')
    async getPending(
        @Res() res:Response,
    ){
        const result = await this.dbService.getPending();
        return res.status(HttpStatus.OK).json(result);
    }
}