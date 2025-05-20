import { Controller, Req, Res, HttpStatus, Get, Query, Param, Put, Body, Post, UseGuards } from '@nestjs/common';
import { MembersService } from '../service/members.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MembersResponseDto } from '../dto/members/members-response.dto';
import { MembersIdResponseDto } from '../dto/members/members-id-response.dto';
import { MembersConvertToShareholderRequestDto } from '../dto/members/members-convert-to-shareholder-request.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { MembersDirectorStatusRequestDto } from '../dto/members/members-director-status-request.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { MEMBER_LEVEL } from '../utils/enum';
import { Uuidv1ValidationPipe } from '../utils/pipes/uuid-validation';
import { MemberTransferLogDto } from '../dto/members/member-transfer-log.dto';
import { MemberTransferLogRes } from '../dto/members/member-transfer-log-response';

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
    @Res() res: Response,
  ) {
    // phone ksno
    const mmRes = await this.membersService.members(search, type);
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
    @Res() res: Response,
  ) {
    const mmRes = await this.membersService.membersId(id);
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
    @Res() res: Response,
  ) {
    const comRes = await this.membersService.getMembersTransferLog(
      logReq
    );
    return res
      .status(HttpStatus.OK)
      .json(comRes);
  }
}
