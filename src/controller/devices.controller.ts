import { Controller, Delete, Get, HttpStatus, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TokenGuard } from '../utils/tokens/token-guard';
import { DevicesResponse } from '../dto/devices/devices-response';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { DevicesService } from '../service/devices.service';
import { AddTraceIdToResponse } from '../utils/constant';

@Controller('devices')
@ApiTags('devices')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class DevicesController {
    constructor(private readonly devicesService:DevicesService){}
    @ApiOperation({
        summary: '取得會員登入設備列表',
        description: '',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: DevicesResponse,
    })
    @Get()
    async getDevice(@Req() req:any, @Res() res:Response){
        const devRes = await this.devicesService.getDevices(req.user);
        AddTraceIdToResponse(devRes, req);
        return res.status(HttpStatus.OK).json(devRes);
    }


    @ApiOperation({
        summary: '刪除登入設備',
        description: ''
    })
    @ApiParam({
        name: 'deviceId', description: '登入設備編號', type: String
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @Delete(':deviceId')
    async delDevice(@Param('deviceId') deviceId:string,@Req() req:any, @Res() res:Response){
        const comRes = await this.devicesService.delDevice(req.user, deviceId);
        return res.status(HttpStatus.OK).json(comRes);
    }
}