import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from '../utils/tokens/token-guard';
import { DashboardService } from 'src/service/dashboard.service';
import { Response } from 'express';

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
    @Get('pending')
    async getPending(
        @Res() res:Response,
    ){
        const result = await this.dbService.getPending();
        return res.status(HttpStatus.OK).json(result);
    }
}