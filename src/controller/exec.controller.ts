import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { couponsAutoIssue } from '../utils/coupons/coupons-auto-issue';
import { TokenGuard } from '../utils/tokens/token-guard';

@Controller('exec')
@ApiTags('exec')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class ExecController {
    @Get('CouponAutoIssue')
    async doCoponbatchAutoIssue(
        @Res() res:Response,
    ) {
        await couponsAutoIssue();
        return res.status(HttpStatus.OK).json(new CommonResponseDto());
    }
}