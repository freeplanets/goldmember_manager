import { Controller, Req, Res, HttpStatus, Get, Param, Post, Body, Put, UseGuards } from '@nestjs/common';
import { CouponsService } from '../service/coupons.service';
import { Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiProperty, ApiBody, ApiParam } from '@nestjs/swagger';
import { CouponResponseDto } from '../dto/coupons/coupon-response.dto';
import { CouponBatchesResponseDto } from '../dto/coupons/coupon-batches-response.dto';
import { CouponBatchesIdResponseDto } from '../dto/coupons/coupon-batches-id-response.dto';
import { CouponBatchPostDto } from '../dto/coupons/coupon-batch-post.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { CouponRequestDto } from '../dto/coupons/coupon-request.dto';
import { CouponListResponseDto } from '../dto/coupons/coupon-list-response.dto';
import { ErrCode } from '../utils/enumError';
import { TokenGuard } from '../utils/tokens/token-guard';
import { CouponBatchListRequestDto } from '../dto/coupons/coupon-batch-list-request.dto';
import { CouponAutoIssueLogReqDto } from '../dto/coupons/coupon-auto-issue-log-request.dto';
import { CouponLogRes } from '../dto/coupons/coupon-log-response';
import { CouponTransferLogReqDto } from '../dto/coupons/coupon-transfer-log-request.dto';
import { CouponTransferLogRes } from '../dto/coupons/coupon-transfer-log-response';
import { CouponBatchModifyDto } from '../dto/coupons/coupon-batch-modify.dto';
import { Coupon2PaperDto } from '../dto/coupons/coupon-2-paper.dto';
import { CouponUseReqDto } from '../dto/coupons/coupon-use-request.dto';
import { CouponTransferDto } from '../dto/coupons/coupon-transfer.dto';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';

@Controller('couponbatches')
@ApiTags('couponbatches')
@UseGuards(TokenGuard)
@ApiBearerAuth()
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
    @Res() res: Response,
  ) {
    const clRes = await this.couponsService.coupons(couponRequestDto);
    return res.status(HttpStatus.OK).json(clRes);
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
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const crRes = await this.couponsService.couponsCode(id);
    return res.status(HttpStatus.OK).json(crRes);
  }

  @ApiOperation({
    summary: '使用優惠券',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('coupon/use')
  async couponsCodeUse(
    // @Param('id') id: string,
    @Body() { id, notes }:CouponUseReqDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponsCodeUse(id, notes, req.user);
    return res.status(HttpStatus.OK).json(comRes);
  }

  @ApiOperation({
    summary: '將電子券轉換為紙本券',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @ApiBody({
    description: '電子券ID&紙本票號',
    type: Coupon2PaperDto,
    isArray: true, 
  })
  @Post('coupon/convert_to_paper/')
  async couponsCodeConvertToPaper(
    @Body() coupon2papers:Coupon2PaperDto[],
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponsCodeConvertToPaper(coupon2papers, req.user);
    return res.status(HttpStatus.OK).json(comRes);
  }

  @ApiOperation({
    summary: '轉移優惠券',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('coupon/transfer')
  async couponsTransfer(
    @Body() coupTransfer:CouponTransferDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponsTransfer(coupTransfer, req.user);
    return res.status(HttpStatus.OK).json(comRes);
  }

  @ApiOperation({
    summary: '依日期查詢優惠劵使用情形',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('coupon/used_list')
  async couponsUsedList(
    @Body() dates:DateRangeQueryReqDto,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponsUsedList(dates);
    return res.status(HttpStatus.OK).json(comRes);
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
    @Body() couponBatchRequestDto: CouponBatchListRequestDto,
    @Res() res: Response,
  ) {
    const cbRes = await this.couponsService.couponBatches(couponBatchRequestDto);
    return res.status(HttpStatus.OK).json(cbRes);
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
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponBatchesPost(
        couponBatchPostDto,
        req.user,
      );
    return res.status(HttpStatus.OK).json(comRes);
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
    @Res() res: Response,
  ) {
    const cbRes = await this.couponsService.couponBatchedId(id);
    return res.status(HttpStatus.OK).json(cbRes);
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
    @Body() couponBatchPostDto: CouponBatchModifyDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = new CommonResponseDto();
    try {
      const rlt = await this.couponsService.couponBatchedIdPut(
        id,
        couponBatchPostDto,
        req.user,
      );
      console.log("update", rlt);
    } catch (e) {
      comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
      comRes.error.extra = e;
    }
    return res.status(HttpStatus.OK).json(comRes);
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
    // @Body() authReq:CouponbatchAuthorizeReqDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponBatchedIdAuthorize(id, req.user);

    return res
      .status(HttpStatus.OK)
      .json(comRes);
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

    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.couponsService.couponBatchedIdCancel(id, req.user);
    return res
      .status(HttpStatus.OK)
      .json(comRes);
  }

  @ApiOperation({
    summary: '優惠券自動發行記錄',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponLogRes,
  })
  @Post('autoissuelog')
  async getAutoIssueLog(
    @Body() coupReq:CouponAutoIssueLogReqDto,
    @Res() res:Response,
  ) {
    const cplogRes = await this.couponsService.getCouponLog(coupReq);
    res.status(HttpStatus.OK).json(cplogRes);
  }

  @ApiOperation({
    summary: '優惠券轉移記錄',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponTransferLogRes,
  })
  @Post('transferlog')
  async getTransferLog(
    @Body() coupReq:CouponTransferLogReqDto,
    @Res() res:Response,
  ) {
    const cplogRes = await this.couponsService.getTransferLog(coupReq);
    res.status(HttpStatus.OK).json(cplogRes);
  }

  @ApiOperation({
    summary: '優惠券自動批次停用',
    description: '優惠券自動批次停用',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CouponTransferLogRes,
  })
  @ApiParam({name: 'id', description: '優惠券批次 ID', required: true})
  @Get('automatic/stop/:id')
  async automaticStop(
    @Param('id') id:string,
    @Req() req:any,
    @Res() res:Response,
  ) {
    const rlt = await this.couponsService.automaticStop(id, req.user);
    return res.status(HttpStatus.OK).json(rlt);
  }
}
