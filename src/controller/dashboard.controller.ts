import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from '../utils/tokens/token-guard';
import { DashboardService } from '../service/dashboard.service';
import { Request, Response } from 'express';
import { PendingAllResponse } from '../dto/dashboard/pending-all.response';
import { AddTraceIdToResponse } from '../utils/constant';

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
        @Req() req:Request,
        @Res() res:Response,
    ){
        const result = await this.dbService.getPending();
        AddTraceIdToResponse(result, req);
        return res.status(HttpStatus.OK).json(result);
    }
}