import { Controller, Req, Res, HttpStatus, Get, Query, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersResponseDto } from '../dto/users/users-response.dto';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { CommonResponseDto } from '../dto/common-response.dto';
import { UserCreateDataDto } from '../dto/users/user-create-data.dto';
import { UsersIdResponseDto } from '../dto/users/users-id-response.dto';
import { UserStatusDto } from '../dto/users/user-status.dto';
import { ErrCode, ErrMsg } from '../utils/enumError';
import { TokenGuard } from '../utils/token-guard';

@Controller('users')
@ApiTags('users')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '取得使用者列表',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: UsersResponseDto,
  })
  @Get('')
  async usersGet(
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    this.usersService.usersGet(search).then((rtn) => {
      const userRes = new UsersResponseDto();
      if (rtn) {
        userRes.data = rtn;
      } else {
        userRes.errorcode = ErrCode.ERROR_PARAMETER;
        userRes.error = {
          message: ErrMsg.ERROR_PARAMETER,
        }
      }
      return res.status(HttpStatus.OK).json(userRes);
    }).catch((e) => {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    });
  }

  @ApiOperation({ summary: '新增使用者', description: '' })
  @ApiResponse({ description: '成功或失敗', type: CommonResponseDto })
  @Post('')
  async usersPost(
    @Body() usersPostRequestDto: UserCreateDataDto,
    @Res() res: Response,
  ) {
    const rlt = new CommonResponseDto();
    this.usersService.usersPost(usersPostRequestDto).then((rtn) => {
      return res.status(HttpStatus.OK).json(rlt);        
    }).catch( (e) => {
      rlt.error = e;
      rlt.errorcode = ErrCode.ERROR_PARAMETER;
      return res.status(HttpStatus.BAD_REQUEST).json(rlt);
      // throw new CommonError(
      //   e.type || ERROR_TYPE.SYSTEM,
      //   e.status || STATUS_CODE.FAIL,
      //   e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
      //   e.message,
      // );
    })    
  }

  @ApiOperation({
    summary: '取得使用者詳細資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: UsersIdResponseDto,
  })
  @Get('/:id')
  async usersId(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const userRes = new UsersIdResponseDto()
    const rlt = await this.usersService.usersId(id);
    if (rlt) {
      userRes.data = rlt;
    } else {
      userRes.errorcode = ErrCode.ERROR_PARAMETER;
      userRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(userRes);
  }

  @ApiOperation({
    summary: '更新使用者資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Put('/:id')
  async usersPutId(
    @Param('id') id: string,
    @Body() usersIdPutRequestDto: UserCreateDataDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const commonRes = new CommonResponseDto();
    const rlt = await this.usersService.usersPutId(id, usersIdPutRequestDto);
    if (!rlt) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrCode.ERROR_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(commonRes);
  }

  @ApiOperation({
    summary: '更新使用者狀態',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Put('status/:id/')
  @ApiParam({name: 'id', description: '使用者ID'})
  async usersIdStatus(
    @Param('id') id: string,
    @Body() userStatus: UserStatusDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const commonRes = new CommonResponseDto()
    const ans = await this.usersService.usersIdStatus(id, userStatus.isActive);
    if (!ans) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrMsg.MISS_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(commonRes);
  }

  @ApiOperation({
    summary: '重置使用者的雙因素驗證',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('/reset_2fa/:id')
  async usersIdReset2Fa(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const commonRes = new CommonResponseDto();
    const ans = await this.usersService.usersIdReset2Fa(id);
    if (!ans) {
      commonRes.errorcode = ErrCode.ERROR_PARAMETER;
      commonRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(new CommonResponseDto());
  }
}
