import { Body, Controller, Get, HttpStatus, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { couponsAutoIssue } from '../utils/coupons/coupons-auto-issue';
import { TokenGuard } from '../utils/tokens/token-guard';
import { ExecService } from '../service/exec.service';
import * as ExcelJS from 'exceljs';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
//import { FilesUploadDto } from '../dto/common/files-upload.dto';
import { TextWithFile } from '../dto/common/text-with-file.dto';
import { FileNamePipe } from '../utils/pipes/file-name';
import { FormDataPipe } from '../utils/pipes/form-data';
import { AnnouncementCreateDto } from '../dto/announcements/announcement-create.dto';

@Controller('exec')
@ApiTags('exec')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class ExecController {
    constructor(private readonly execService:ExecService){}
    @Get('CouponAutoIssue')
    @ApiExcludeEndpoint(true)
    async doCoponbatchAutoIssue(
        @Res() res:Response,
    ) {
        await couponsAutoIssue();
        return res.status(HttpStatus.OK).json(new CommonResponseDto());
    }

    @Get('export')
    @ApiExcludeEndpoint(true)
    async exportKsMember(
        @Res() res:Response
    ){
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.columns = [
            { header: '編號', key:'no'},
            { header: '姓名', key:'name'},
            { header: '性別', key:'gender'},
            { header: '生日', key:'birthday'},
            { header: '類別', key:'types'},
            { header: '實名', key:'realUser'},
        ]
        const ksmbr = await this.execService.getKsMember();
        ksmbr.forEach((mbr) => {
            worksheet.addRow(
                {
                    no: mbr.no,
                    name: mbr.name,
                    gender: mbr.gender,
                    birthday: mbr.birthday,
                    types: mbr.types,
                    realUser: mbr.realUser, 
                }
            )
        });
        const buffer = await workbook.csv.writeBuffer()
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=example.xls');
        //res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //await workbook.xlsx.write(res);
        //res.end();
        res.send(buffer);    
    }

    // @Get('initData')
    // async initData(
    //     @Res() res:Response,
    // ) {
    //     await this.execService.initData();
    //     return res.status(HttpStatus.OK).json(new CommonResponseDto());
    // }

    // @Post('imageverify')
    // @ApiConsumes('multipart/form-data')
    // //@UseInterceptors(FileInterceptor('file'))
    // @UseInterceptors(AnyFilesInterceptor())
    // @ApiBody({
    //     description: '上傳圖片檔案',
    //     type: AnnouncementCreateDto,
    //     //type: FilesUploadDto,
    // })
    // async verifyImage(
    //     @Body(FormDataPipe) ann:AnnouncementCreateDto,
    //     @UploadedFiles(FileNamePipe) files:Array<Express.Multer.File>,
    //     @Res() res:Response,
    // ) {
    //     console.log(files[0], files[1]);
    //     const file = files[0];
    //     const rlt = await this.execService.verifyImage(file);
    //     return res.status(HttpStatus.OK).json(rlt);
    // }    
    
    // @Post('upload')
    // @ApiConsumes('multipart/form-data')
    // @UseInterceptors(AnyFilesInterceptor())
    // @ApiBody({
    //     description: '公告內容及上傳檔案',
    //     type: FilesUploadDto,
    // })
    // async upfile(
    //     @UploadedFiles() files: Array<Express.Multer.File>,
    //     @Res() res:Response,
    // ) {
    //     const rlt = await this.execService.uploads(files);
    //     return res.status(HttpStatus.OK).json(rlt);
    // }
}