import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReservationsResponse } from '../dto/reservations/reservations-response';
import { ReservationsService } from '../service/reservations.service';
import { Response } from 'express';
import { ReservationsQueryRequestDto } from '../dto/reservations/reservations-query-request.dto';
import { ReservationCreateRequestDto } from '../dto/reservations/reservation-create-request.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { ReservationResponse } from '../dto/reservations/reservation-response';
import { ReservationModifyRequestDto } from 'src/dto/reservations/reservation-modify-request.dto';

@Controller('reservations')
@ApiTags('reservations')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class ReservationsController {
    constructor(private readonly rsvService:ReservationsService){}

    @ApiOperation({
        summary: '取得預約列表',
        description: '取得預約列表',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: ReservationsResponse,
    })
    @Get()
    async getReservations(
        @Query() qryParam: ReservationsQueryRequestDto,
        @Res() res:Response,
    ){
        const result = await this.rsvService.getReservations(qryParam);
        return res.status(HttpStatus.OK).json(result);

    }

    @ApiOperation({
        summary: '新增預約',
        description: '新增一筆預約記錄',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })   
    @Post()
    async createReservation(
        @Body() createResv:ReservationCreateRequestDto,
        @Req() req:any,
        @Res() res:Response,
    ) {
        const result = await this.rsvService.createReservation(createResv, req.user);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '取得特定預約詳情',
        description: '根據 ID 取得特定預約的詳細資訊'
    })
    @ApiResponse({
        description: '成功或失敗',
        type: ReservationResponse,
    })
    @ApiParam({name: 'id', description: '預約 ID'})
    @Get(':id')
    async getReservationById(
        @Param('id') id:string,
        @Res() res:Response,
    ) {
        const result = await this.rsvService.getReservationById(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '更新預約',
        description: '更新特定預約的資訊',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })    
    @ApiParam({name: 'id', description: '預約 ID'})
    @Put(':id')
    async modifyReservation(
        @Param('id') id:string,
        @Body() mfyResv:ReservationModifyRequestDto,
        @Req() req:any,
        @Res() res:Response,
    ) {
        const result =  await this.rsvService.modifyReservation(id, mfyResv, req.user);
        return res.status(HttpStatus.OK).json(result);
    }
}