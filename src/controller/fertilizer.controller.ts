import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FertilizerService } from '../service/fertilizer.service';
import { TokenGuard } from '../utils/tokens/token-guard';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { InventoryCreateReqDto } from '../dto/fertilizer/inventory-create-request.dto';
import { InventoryModiReqDto } from '../dto/fertilizer/inventory-modify-requst.dto';
import { CategoryModifyReqDto } from '../dto/fertilizer/category-modify-request.dto';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { StockInOutReqDto } from '../dto/fertilizer/stock-in-out-request.dto';
import { AddTraceIdToResponse } from '../utils/constant';

@Controller('fertilizer')
@ApiTags('產品分類管理')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class FertilizerController {
    constructor(private readonly fertilizerService:FertilizerService){}

    @ApiOperation({
        summary: '取得所有產品分類',
        description: '取得所有產品分類',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @Get('categories')
    async getCategories(
        @Req() req:Request,
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.getCategories();
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '新增產品分類',
        description: '新增產品分類',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })    
    @Post('categories')
    async addCategories(
        @Body() { name } :CategoryModifyReqDto,
        @Req() req:Request,
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.addCategory(name, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '更新產品分類',
        description: '更新產品分類',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @ApiParam({name: 'id', description: '類別ID', required: true})
    @Put('categories/:id')
    async modifyCategories(
        @Param('id') id: string,
        @Body() { name } :CategoryModifyReqDto,
        @Req() req:Request,        
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.modifyCategory(id, name, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '刪除產品分類',
        description: '刪除產品分類',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @ApiParam({name: 'id', description: '類別ID', required: true})
    @Delete('categories/:id')
    async delCategory(
        @Param('id') id: string,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.delCategory(id);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '取得所有產品',
        description: '取得所有產品',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @Get('products')
    async getInventories(
        @Req() req:Request,
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.getInventories();
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '新增產品',
        description: '新增產品',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })    
    @Post('products')
    async addInventory(
        @Body() data:InventoryCreateReqDto,
        @Req() req:Request,
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.addInventory(data, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '更新產品',
        description: '更新產品',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @ApiParam({name: 'id', description: '產品ID', required: true})
    @Put('products/:id')
    async modifyInventory(
        @Param('id') id: string,
        @Body() data:InventoryModiReqDto,
        @Req() req:Request,        
        @Res() res:Response,
    ){
        const rlt = await this.fertilizerService.modifyInventory(id, data, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '刪除產品',
        description: '刪除產品',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @ApiParam({name: 'id', description: '產品ID', required: true})
    @Delete('products/:id')
    async delInventory(
        @Param('id') id: string,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.delInventory(id);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }
    
    @ApiOperation({
        summary: '取得進貨記錄',
        description: '取得進貨記錄',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @Get('stock-in')
    async getStockIn(
        @Query() dates:DateRangeQueryReqDto,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.getStockIn(dates);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '新增進貨記錄',
        description: '新增進貨記錄',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @Post('stock-in')
    async stockin(
        @Body() data:StockInOutReqDto,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.stockin(data, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '取得出貨記錄',
        description: '取得出貨記錄',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @Get('stock-out')
    async getStockOut(
        @Query() dates:DateRangeQueryReqDto,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.getStockOut(dates);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '新增出貨記錄',
        description: '新增出貨記錄',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @Post('stock-out')
    async stockout(
        @Body() data:StockInOutReqDto,
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.stockout(data, req['user']);
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: '取得庫存總量統計',
        description: '統計所有商品的進貨總量、出貨總量和當前庫存。 庫存 = 進貨總量 - 出貨總量',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })       
    @Get('stock-summary')
    async getStocSummary(
        @Req() req:Request,
        @Res() res:Response, 
    ) {
        const rlt = await this.fertilizerService.getSummary();
        AddTraceIdToResponse(rlt, req);
        return res.status(HttpStatus.OK).json(rlt);
    }    
}