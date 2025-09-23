import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FieldManagementService } from '../service/field-management.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiParamOptions, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from '../utils/tokens/token-guard';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { Request, Response } from 'express';
import { GreenSpeedCreateReqDto } from '../dto/field-management/green-speed-create-request.dto';
import { GreenSpeedModifyReqDto } from '../dto/field-management/green-speed-modify-request.dto';
import { FairwayDataRes } from '../dto/field-management/fairway-data.response';
import { FairwayModifyDataDto } from '../dto/field-management/fairway-modify-data.dto';
import { CoursesRes } from '../dto/field-management/courses-response';
import { CourseModifyReqDto } from '../dto/field-management/course-modify-request.dto';
import { IrrigationDecisionRes } from '../dto/field-management/irrigation-decision-response';
import { IrrigationDecisionReqDto } from '../dto/field-management/irrigation-decision-request.dto';
import { FAIRWAY_PATH } from '../utils/enum';
import { AddTraceIdToResponse } from '../utils/constant';

@Controller('field-management')
@ApiTags('field-management')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class FieldManagementController {
    constructor(private readonly fmService:FieldManagementService){}

    @ApiOperation({
        summary: '取得果嶺速度記錄',
        description: '查詢指定日期範圍內的果嶺速度記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,
    })
    @Get('green-speeds')
    async getGreenSpeeds(
      @Query() dates:DateRangeQueryReqDto,
      @Req() req:Request,
      @Res() res:Response,
    ){
      const rlt = await this.fmService.getGreenSpeeds(dates);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }


    @ApiOperation({
      summary: '新增果嶺速度記錄',
      description: '新增新的果嶺速度記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @Post('green-speeds')
    async createGreenSpeed(
      @Body() data:GreenSpeedCreateReqDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.createGreenSpeeds(data, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '新增果嶺速度記錄',
      description: '更新現有的果嶺速度記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @ApiParam({name: 'id', description: '記錄唯一識別碼'})
    @Put('green-speeds/:id')
    async updateGreenSpeed(
      @Param('id') id:string,
      @Body() data: GreenSpeedModifyReqDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.updateGreenSpeeds(id, data, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '取得球道資料',
      description: '取得所有球道的詳細資料，包含三個區域（西、南、東）的球道資訊',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: FairwayDataRes,      
    })
    @Get('fairway-data')
    async getFairwayData(
      @Req() req:Request,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.getFairwayData();
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '更新指定球道資料',
      description: '更新特定球道的資料（距離、標準桿、難度指數）',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @ApiParam({name: 'course', description: '球道區域', required: true ,enum: FAIRWAY_PATH})
    @ApiParam({name: 'fairway', description: '球道號碼 (1-9)', required: true})
    @Put('fairway-data/:course/:fairway')
    async modifyFairwayData(
      @Param('course') course:string,
      @Param('fairway', ParseIntPipe) fairway:number,
      //@Query() query:FairwayModifyQueryDto,
      @Body() body:FairwayModifyDataDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.modifyFairwayData(course, fairway, body, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '取得組合賽道資料',
      description: '取得所有組合賽道的配置資料，包含不同 Tee 台的 Rating 和 Slope 值',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CoursesRes,      
    })    
    @Get('combined-courses')
    async getCourses(
      @Req() req:Request,
      @Res() res:Response,
    ){
      const rlt = await this.fmService.getCourses();
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '更新組合賽道資料',
      description: '更新指定組合賽道的 Tee 台配置資料',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @ApiParam({name: 'courseIndex', description: '組合賽道索引 (0-2)', required: true})
    @Put('combined-courses/:courseIndex')
    async modifyCourses(
      @Param('courseIndex', ParseIntPipe) courseIndex:number,
      @Body() data:CourseModifyReqDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.modifyCourses(courseIndex, data, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt)
    }

    @ApiOperation({
      summary: '取得果嶺灌溉決策記錄',
      description: '查詢指定日期範圍內的果嶺灌溉決策記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: IrrigationDecisionRes,      
    })
    @Get('irrigation-decisions')
    async getIrrigationDecisions(
      @Query() dates:DateRangeQueryReqDto,
      @Req() req:Request,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.getIrrigationDecisions(dates);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }
    
    @ApiOperation({
      summary: '新增果嶺灌溉決策記錄',
      description: '新增新的果嶺灌溉決策記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @Post('irrigation-decisions')
    async addIrrigationDecision(
      @Body() data:IrrigationDecisionReqDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.addIrrigationDecision(data, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
      summary: '新增果嶺灌溉決策記錄',
      description: '新增新的果嶺灌溉決策記錄',
    })
    @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,      
    })
    @ApiParam({name: 'id', description: '記錄唯一識別碼', required: true})
    @Put('irrigation-decisions/:id')
    async updateIrrigationDecision(
      @Param('id') id:string,
      @Body() data:IrrigationDecisionReqDto,
      @Req() req:any,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.updateIrrigationDecision(id, data, req.user);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }
    
    @Get('initCourseData')
    async initCourseData(
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.initCourseData();
      return res.status(HttpStatus.OK).json(rlt);
    }

    @Get('initFairwayData')
    async initFairwayData(
      @Req() req:Request,
      @Res() res:Response,
    ) {
      const rlt = await this.fmService.initFairwayData();
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
    }
}