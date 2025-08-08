import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { couponsAutoIssue } from '../utils/coupons/coupons-auto-issue';
import { TokenGuard } from '../utils/tokens/token-guard';
import { ExecService } from '../service/exec.service';
import * as ExcelJS from 'exceljs';

@Controller('exec')
@ApiTags('exec')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class ExecController {
    constructor(private readonly execService:ExecService){}
    @Get('CouponAutoIssue')
    async doCoponbatchAutoIssue(
        @Res() res:Response,
    ) {
        await couponsAutoIssue();
        return res.status(HttpStatus.OK).json(new CommonResponseDto());
    }

    @Get('export')
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
}