import { Controller, Req, Res, HttpStatus, Get, Query, Param, Put, Body, Post, UseGuards } from '@nestjs/common';
import { MembersService } from '../service/members.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MembersResponseDto } from '../dto/members/members-response.dto';
import { MembersIdResponseDto } from '../dto/members/members-id-response.dto';
import { MembersConvertToShareholderRequestDto } from '../dto/members/members-convert-to-shareholder-request.dto';
import { CommonResponseDto } from '../dto/common-response.dto';
import { MembersDirectorStatusRequestDto } from '../dto/members/members-director-status-request.dto';
import { ErrCode, ErrMsg } from '../utils/enumError';
import { TokenGuard } from '../utils/token-guard';

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
  @Get('')
  async members(
    @Query('search') search: string,
    @Query('type') type: string,
    @Res() res: Response,
  ) {
    const mmRes = new MembersResponseDto();
    const rlt = await this.membersService.members(search, type);
    console.log("rlt:", rlt);
    if (rlt) {
      mmRes.data = rlt;
    } else {
      mmRes.errorcode = ErrCode.ERROR_PARAMETER;
      mmRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
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
    const mmRes = new MembersIdResponseDto();
    const rlt = await this.membersService.membersId(id);
    if (rlt) {
      mmRes.data = rlt;
    } else {
      mmRes.errorcode = ErrCode.ERROR_PARAMETER;
      mmRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
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
    @Res() res: Response,
  ) {
    const commonRes = new CommonResponseDto();
    const ans = await this.membersService.membersIdDirectorStatus(
      id,
      membersDirectorStatusRequestDto,
    );
    if (!ans) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const commonRes = new CommonResponseDto()
    const ans = await this.membersService.membersConvertToShareholder(
      membersConvertToShareholderRequestDto,
      req,
    );
    if (!ans) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
    return res
      .status(HttpStatus.OK)
      .json(commonRes);
  }
}
