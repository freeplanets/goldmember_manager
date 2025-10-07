import { Controller, Req, Res, HttpStatus, Get, Query, Param, Put, Body, Post, UseGuards, Delete } from '@nestjs/common';
import { MembersService } from '../service/members.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MembersResponseDto } from '../dto/members/members-response.dto';
import { MembersIdResponseDto } from '../dto/members/members-id-response.dto';
import { MembersConvertToShareholderRequestDto } from '../dto/members/members-convert-to-shareholder-request.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { MembersDirectorStatusRequestDto } from '../dto/members/members-director-status-request.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { MEMBER_LEVEL } from '../utils/enum';
import { MemberTransferLogDto } from '../dto/members/member-transfer-log.dto';
import { MemberTransferLogRes } from '../dto/members/member-transfer-log-response';
import { CreditRequestDto } from '../dto/teams/credit-request.dto';
import { CreditRecordRes } from '../dto/teams/credit-record-response';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { InvitationCodeRes } from '../dto/members/invitation-codes-response';
import { AddTraceIdToResponse } from '../utils/constant';

@Controller('members')
@ApiTags('members')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiOperation({
    summary: '取得會員列表',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: MembersResponseDto,
  })
  @ApiQuery({name: 'search', description:'欄位 username & displayname 關鍵字查詢或 手機號碼，國興會員代號(至少三個數字)'})
  @ApiQuery({name: 'type', description:'會員分類', enum: MEMBER_LEVEL, example: MEMBER_LEVEL.GENERAL_MEMBER})
  @Get('')
  async members(
    @Query('search') search: string,
    // @Query('phone') phone: string,
    @Query('type') type: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // phone ksno
    const mmRes = await this.membersService.members(search, type);
    AddTraceIdToResponse(mmRes, req);
    return res.status(HttpStatus.OK).json(mmRes);
  }

  @ApiOperation({
    summary: '取得會員詳細資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: MembersIdResponseDto,
  })
  @Get('/:id')
  async membersId(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const mmRes = await this.membersService.membersId(id);
    AddTraceIdToResponse(mmRes, req);
    return res.status(HttpStatus.OK).json(mmRes);
  }

  @ApiOperation({
    summary: '更新會員的董監事身分',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Put('/:id')
  async membersIdDirectorStatus(
    @Param('id') id: string,
    @Body() membersDirectorStatusRequestDto: MembersDirectorStatusRequestDto,
    @Req() req:any,
    @Res() res: Response,
  ) {
    const commonRes = await this.membersService.membersIdDirectorStatus(
      id,
      membersDirectorStatusRequestDto,
      req.user,
    );
    AddTraceIdToResponse(commonRes, req);
    return res.status(HttpStatus.OK).json(commonRes);
  }

  @ApiOperation({
    summary: '一般會員轉換為股東',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('/convert2shareholder')
  async membersConvertToShareholder(
    @Body()
    membersConvertToShareholderRequestDto: MembersConvertToShareholderRequestDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const commonRes = await this.membersService.membersConvertToShareholder(
      membersConvertToShareholderRequestDto,
      req.user,
    );
    AddTraceIdToResponse(commonRes, req);
    return res
      .status(HttpStatus.OK)
      .json(commonRes);
  }

  @ApiOperation({
    summary: '會員轉換記錄',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: MemberTransferLogRes,
  })
  @Post('/transferlog')
  async membersTransferLog(
    @Body() logReq: MemberTransferLogDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const comRes = await this.membersService.getMembersTransferLog(
      logReq
    );
    AddTraceIdToResponse(comRes, req);
    return res
      .status(HttpStatus.OK)
      .json(comRes);
  }
  @ApiOperation({
      summary: "新增會員信用評分",
      description: "新增會員信用評分.",
  })
  @ApiResponse({
      description: '成功或失敗',
      type: CommonResponseDto,
  })
  @Post('credit/:id')
  async updateTeamCredit(
      @Body() creditInfo: CreditRequestDto,
      @Param('id') id: string,
      @Req() req: any,
      @Res() res: Response,
  ){
      const result = await this.membersService.updateCredit(id, creditInfo, req.user);
      AddTraceIdToResponse(result, req);
      return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({
    summary: "查詢會員信用評分",
    description: "查詢會員信用評分.",
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CreditRecordRes,
  })
  @ApiParam({name: 'id', description: '會員代號'})
  @Get('creditrecords/:id')
  async getCreditRecords(
      @Param('id') memberId: string,
      @Query() dates:DateRangeQueryReqDto,
      @Req() req:Request,
      @Res() res:Response,
  ){
      const rlt = await this.membersService.getCreditRecords(memberId, dates);
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
  }

  @ApiOperation({
    summary: "會員認證碼列表",
    description: "會員認證碼列表.",
  })
  @ApiResponse({
    description: '成功或失敗',
    type: InvitationCodeRes,
  })
  @Post('invitationcodes')
  async getInvitationCodes(
    @Req() req:Request,
    @Res() res:Response,
  ){
      const rlt = await this.membersService.getInvitationCodes();
      AddTraceIdToResponse(rlt, req);
      return res.status(HttpStatus.OK).json(rlt);
  }

  @ApiOperation({
    summary: '會員剛除帳號',
    description: '會員刪除帳號',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @ApiParam({name: 'id', description: '會員ID', required: true})
  @Delete('account/:id')
  async delAccount(
    @Param('id') id:string,
    @Req() req:Request,
    @Res() res:Response
  ){
    const rlt = await this.membersService.delAccount(id);
    return res.status(HttpStatus.OK).json(rlt);
  }    
}
