import { Controller, Req, Res, HttpStatus, Get, Post, Body, Param, Put, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnnouncementsService } from '../service/announcements.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AnnouncementsResponseDto } from '../dto/announcements/announcements-response.dto';
import { AnnouncementsIdResponseDto } from '../dto/announcements/announcements-id-response.dto';
import { AnnouncementSearch } from '../dto/announcements/announcements-search.dto';
import { AnnouncementCreateDto } from '../dto/announcements/announcement-create.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AnnouncementFilterDto } from '../dto/announcements/announcement-filter.dto';
import { AnnouncementsFilterResponseDto } from '../dto/announcements/announcements-filter-response.dto';
import { AnnouncementModifyDto } from '../dto/announcements/announcement-modify.dto';
import { AnnouncePublishRequest } from '../dto/announcements/announce-publish-request';

@Controller('announcements')
@ApiTags('announcements')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @ApiOperation({
    description: '輸入過瀘條件後的會員數',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AnnouncementsFilterResponseDto,
  })
  @Post('membercount')
  async getMembersCount(
    @Body() filters:AnnouncementFilterDto,
    @Res() res:Response,
  ) {
    const afRes = await this.announcementsService.getMemberCountByFilter(filters);
    return res.status(HttpStatus.OK).json(afRes);
  }

  @ApiOperation({
    summary: '取得公告列表',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AnnouncementsResponseDto,
  })
  @Post('list')
  async announcementsGet(
    @Body() announceSearch: AnnouncementSearch,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const annRes = await this.announcementsService.announcementsGet(announceSearch);
    return res.status(HttpStatus.OK).json(annRes);
  }

  @ApiOperation({
    summary: '新增公告',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '公告內容及上傳檔案',
    type: AnnouncementCreateDto,
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Post('')
  async announcementsPost(
    @Body() announcementCreateDto: AnnouncementCreateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
    @Res() res: Response,
  ) {
    console.log(req.headers);
    const comRes = await this.announcementsService.announcementsPost(
      req.user,
      announcementCreateDto,
      files,
    );
    return res.status(HttpStatus.OK).json(comRes);
  }

  @ApiOperation({
    summary: '取得公告詳細資料',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: AnnouncementsIdResponseDto,
  })
  @Get('/:id')
  async announcementsIdGet(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const annRes = await this.announcementsService.announcementsIdGet(id);
    return res.status(HttpStatus.OK).json(annRes);
  }

  @ApiOperation({
    summary: '更新公告',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Put('/:id')
  async announcementsIdPut(
    @Param('id') id: string,
    @Body() announceUpdateDto: AnnouncementModifyDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
    @Res() res: Response,
  ) {
    console.log(req.headers);
    const comRes = await this.announcementsService.announcementsIdPut(
        req.user,
        id,
        announceUpdateDto,
        files,
      );
    return res.status(HttpStatus.OK).json(comRes);
  }

  @ApiOperation({
    summary: '發布公告',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('publish/:id')
  async announcementsIdPublish(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes = await this.announcementsService.announcementsIdPublish(id, req.user);
    return res.status(HttpStatus.OK).json(comRes);
  }
  
  @ApiOperation({
    summary: '取消發布公告',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Post('unpublish/:id')
  async announcementsIdUnpublish(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const comRes  = await this.announcementsService.announcementsIdUnpublish(id, req.user);
    return res.status(HttpStatus.OK).json(comRes);
  }
}
