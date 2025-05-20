import { Controller, Req, Res, HttpStatus, Get, Query, Post, Body, Param, Put, UseGuards, Search } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersResponseDto } from '../dto/users/users-response.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { UserCreateDataDto } from '../dto/users/user-create-data.dto';
import { UsersIdResponseDto } from '../dto/users/users-id-response.dto';
import { UserStatusDto } from '../dto/users/user-status.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { UserPutDataDto } from '../dto/users/user-put-data.dto';
import { UserModifyPassDto } from '../dto/users/user-modify-pass.dto';

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
  @ApiQuery({name: 'search', description: '欄位 username & displayname 關鍵字查詢或手機號碼(至少輸入3個數字)', required:false})
  @Get()
  async usersGet(
    @Query('search') search: string,
    // @Param('search') search:string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    // console.log(req.query);
    const userRes = await this.usersService.usersGet(search, req.user);
    return res.status(HttpStatus.OK).json(userRes);
  }

  @ApiOperation({ summary: '新增使用者', description: '' })
  @ApiResponse({ description: '成功或失敗', type: CommonResponseDto })
  @Post('')
  async usersPost(
    @Body() usersPostRequestDto: UserCreateDataDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes =  await this.usersService.usersPost(usersPostRequestDto, req.user);
    return res.status(HttpStatus.BAD_REQUEST).json(comRes);
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
    const rlt = await this.usersService.usersId(id);
    return res.status(HttpStatus.OK).json(rlt);
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
    @Body() usersIdPutRequestDto: UserPutDataDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const commonRes  = await this.usersService.usersPutId(id, usersIdPutRequestDto, req.user);
    return res.status(HttpStatus.OK).json(commonRes);
  }

  @ApiOperation({
    summary: '修改密碼',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('modifypassword')
  async modifyPass(
    @Body() mpass:UserModifyPassDto,
    @Req() req:any,
    @Res() res:Response,
  ){
    const commonRes = await this.usersService.modifyPassword(mpass, req.user);
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
    const commonRes = await this.usersService.usersIdStatus(id, userStatus.isActive);
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const commonRes = await this.usersService.usersIdReset2Fa(id, req);
    return res.status(HttpStatus.OK).json(commonRes);
  }
}
