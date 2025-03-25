import { Controller, Req, Res, HttpStatus, Get, Query, Param, Post, Body, Put } from '@nestjs/common';
import { CouponsService } from '../service/coupons.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponResponseDto } from '../dto/coupons/coupon-response.dto';
import { CouponBatchesResponseDto } from '../dto/coupons/coupon-batches-response.dto';
import { CouponBatchesIdResponseDto } from '../dto/coupons/coupon-batches-id-response.dto';
import { CouponBatchRequestDto } from '../dto/coupons/coupon-batch-request.dto';
import { CouponBatchPostDto } from '../dto/coupons/coupon-batch-post.dto';
import { CommonResponseDto } from '../dto/common-response.dto';
import { CouponRequestDto } from '../dto/coupons/coupon-request.dto';
import { CouponListResponseDto } from '../dto/coupons/coupon-list-response.dto';

@Controller('couponbatches')
@ApiTags('couponbatches')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiOperation({
    summary: '取得優惠券列表',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponListResponseDto,
  })
  @Post('coupon')
  async coupons(
    @Body() couponRequestDto: CouponRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.coupons(couponRequestDto, req);

    return res.status(HttpStatus.OK).json(new CouponListResponseDto());
  }

  @ApiOperation({
    summary: '取得優惠券詳細資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponResponseDto,
  })
  @Get('coupon/:id')
  async couponsCode(
    @Param('id') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponsCode(code, req);

    return res.status(HttpStatus.OK).json(new CouponResponseDto());
  }

  @ApiOperation({
    summary: '使用優惠券',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('coupon/use/:id')
  async couponsCodeUse(
    @Param('id') id: string,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponsCodeUse(id, req);

    return res.status(HttpStatus.OK).json(new CommonResponseDto());
  }

  @ApiOperation({
    summary: '將電子券轉換為紙本券',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('coupon/convert_to_paper/:id')
  async couponsCodeConvertToPaper(
    @Param('id') code: string,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponsCodeConvertToPaper(code, req);

    return res
      .status(HttpStatus.OK)
      .json(new CommonResponseDto());
  }

  @ApiOperation({
    summary: '取得優惠券批次列表',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponBatchesResponseDto,
  })
  @Post('list')
  async couponBatches(
    @Body() couponBatchRequestDto: CouponBatchRequestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatches(couponBatchRequestDto, req);

    return res.status(HttpStatus.OK).json(new CouponBatchesResponseDto());
  }

  @ApiOperation({
    summary: '新增優惠券批次',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('')
  async couponBatchesPost(
    @Body() couponBatchPostDto: CouponBatchPostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatchesPost(
      couponBatchPostDto,
      req,
    );

    return res.status(HttpStatus.OK).json(new CommonResponseDto());
  }

  @ApiOperation({
    summary: '取得優惠券批次詳細資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponBatchesIdResponseDto,
  })
  @Get('/:id')
  async couponBatchedId(
    @Param('id') id: string,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatchedId(id, req);

    return res.status(HttpStatus.OK).json(new CouponBatchesIdResponseDto());
  }

  @ApiOperation({
    summary: '更新優惠券批次',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Put('/:id')
  async couponBatchedIdPut(
    @Param('id') id: string,
    @Body() couponBatchPostDto: CouponBatchPostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatchedIdPut(
      id,
      couponBatchPostDto,
      req,
    );

    return res.status(HttpStatus.OK).json(new CommonResponseDto());
  }

  @ApiOperation({
    summary: '授權發放優惠券批次',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('authorize/:id')
  async couponBatchedIdAuthorize(
    @Param('id') id: string,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatchedIdAuthorize(id, req);

    return res
      .status(HttpStatus.OK)
      .json(new CommonResponseDto());
  }

  @ApiOperation({
    summary: '取消優惠券批次',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('cancel/:id')
  async couponBatchedIdCancel(
    @Param('id') id: string,

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.couponsService.couponBatchedIdCancel(id, req);

    return res
      .status(HttpStatus.OK)
      .json(new CommonResponseDto());
  }
}
