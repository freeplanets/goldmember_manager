import { Body, Controller, Get, HttpStatus, Param, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemParameterService } from '../service/system-parameter.service';
import { Response } from 'express';
import { SettingsResponse } from '../dto/settings/settings.response';
import { ParamTypes } from '../utils/settings/settings.enum';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { TimeslotsResponse } from '../dto/settings/timeslots-response';
import { TimeslotsDto } from '../dto/settings/timeslots.dto';
import { TokenGuard } from '../utils/tokens/token-guard';

@Controller('settings')
@ApiTags('settings')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class SystemParameterController {
    constructor(private readonly spService:SystemParameterService){}


    @Get('init')
    @ApiExcludeEndpoint(true)
    async init(
        @Res() res:Response,
    ){
        const result = await this.spService.init();
        return res.status(HttpStatus.OK).json(result)
    }

    @ApiOperation({
        summary: '取得所有系統參數的列表',
        description: '取得所有系統參數的列表',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: SettingsResponse
    })
    @ApiParam({ name: 'id', description: '參數類別', required: false, enum: ParamTypes})
    @Get('parameters/:id')
    async getParameters(
        @Param('id') key:ParamTypes,
        @Res() res:Response,
    ){
        const result = await this.spService.getParameters(key);
        return res.status(HttpStatus.OK).json(result);
    }
    
    @ApiOperation({
        summary: '更新系統參數值',
        description: '更新系統參數值',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,      
    })
    @ApiParam({ name: 'id', required: true, description: '參數類別', enum: ParamTypes})
    @ApiBody({ 
        description: 'value項下值,項目須相符',
        schema: {
            type: 'Object',
            example: {notification_hours: '72'},
        } 
    })
    @Put('parameters/:id')
    async modifyParameters(
        @Param('id') id:ParamTypes,
        @Body() value: Object,
        @Res() res:Response,
    ){
        const result = await this.spService.modifyParameters(id, value);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '取得預約時段設定',
        description: '取得預約時段設定',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: TimeslotsResponse,
    })
    @Get('reservation-limits')
    async getParamReservation(@Res() res:Response){
        const result = await this.spService.getParamReservation();
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '更新預約時段設定',
        description: '更新預約時段設定',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiBody({
        description: '更新預約時段的設定資訊',
        type: TimeslotsDto,
        isArray: true,
    })
    @Put('reservation-limits')
    async modifyParamReservation(
        @Body() timeslots:TimeslotsDto[],
        @Res() res:Response,
    ) {
        const result = await this.spService.modifyParamReservation(timeslots);
        return res.status(HttpStatus.OK).json(result);
    }
}