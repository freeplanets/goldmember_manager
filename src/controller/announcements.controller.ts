import { Controller, Req, Res, HttpStatus, Get, Query, Post, Body, Param, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnnouncementsService } from '../service/announcements.service';
import { Request, Response } from 'express';
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AnnouncementsResponseDto } from '../dto/announcements/announcements-response.dto';
import { AnnouncementsIdResponseDto } from '../dto/announcements/announcements-id-response.dto';
import { AnnouncementSearch } from '../dto/announcements/announcements-search.dto';
import { AnnouncementCreateDto } from '../dto/announcements/announcement-create.dto';
import { CommonResponseDto } from '../dto/common-response.dto';
import { TokenGuard } from '../utils/token-guard';
import { ErrCode, ErrMsg } from '../utils/enumError';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from '../dto/common/files-upload.dto';

@Controller('announcements')
@ApiTags('announcements')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

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
    const annRes = new AnnouncementsResponseDto();
    const rlt = await this.announcementsService.announcementsGet(announceSearch);
    if (rlt) {
      annRes.data = rlt;
    } else {
      annRes.errorcode = ErrCode.ERROR_PARAMETER;
      annRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
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
  @UseInterceptors(FileInterceptor('files'))
  @Post('')
  async announcementsPost(
    @Body() announcementCreateDto: AnnouncementCreateDto,
    @UploadedFile() files: Express.Multer.File,
    @Res() res: Response,
  ) {
    console.log('announcementCreateDto:', announcementCreateDto);
    console.log("files:", files);
    const commRes = new CommonResponseDto()
    const rlt = await this.announcementsService.announcementsPost(
      announcementCreateDto,
      files
    );
    if (!rlt) {
      commRes.errorcode = ErrCode.ERROR_PARAMETER;
      commRes.error = {
        message: ErrMsg.ERROR_PARAMETER,
      }
    }
    return res.status(HttpStatus.OK).json(commRes);
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.announcementsService.announcementsIdGet(id, req);
    return res.status(HttpStatus.OK).json(new AnnouncementsIdResponseDto());
  }

  @ApiOperation({
    summary: '更新公告',
    description: '',
  })
  @ApiResponse({
    description: '成功或失敗',
    type: CommonResponseDto,
  })
  @Put('/:id')
  async announcementsIdPut(
    @Param('id') id: string,
    @Body() announcementUpdateDto: AnnouncementCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.announcementsService.announcementsIdPut(
      id,
      announcementUpdateDto,
      req,
    );

    return res.status(HttpStatus.OK).json(new CommonResponseDto());
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

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.announcementsService.announcementsIdPublish(id, req);

    return res
      .status(HttpStatus.OK)
      .json(new CommonResponseDto());
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

    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.announcementsService.announcementsIdUnpublish(id, req);

    return res
      .status(HttpStatus.OK)
      .json(new CommonResponseDto());
  }
}
