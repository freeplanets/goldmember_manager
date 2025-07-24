import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import TeamCreateRequestDto from '../dto/teams/team-create-request.dto';
import { TeamsService } from '../service/teams.service';
import { Response } from 'express';
import { TeamMemberAddRequestDto } from '../dto/teams/team-member-add-request.dto';
import { TeamDetailResponse } from '../dto/teams/team-detail-response';
import { TeamUpdateRequestDto } from '../dto/teams/team-update-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from '../dto/common/file-upload.dto';
import { TeamMemberUpdateRequestDto } from '../dto/teams/team-member-update-request.dto';
import { TokenGuard } from '../utils/tokens/token-guard';
import { CreditRequestDto } from '../dto/teams/credit-request.dto';
import { TeamActivitiesCreateRequestDto } from '../dto/teams/team-activities-create-request.dto';
import { TeamActivitiesModifyRequestDto } from '../dto/teams/team-activities-modify-request.dto';
import { ActivityParticipantsResponse } from '../dto/teams/activity-participants-response';
import { FileNamePipe } from '../utils/pipes/file-name';
import { FormDataPipe } from '../utils/pipes/form-data';
import { CreditRecordRes } from '../dto/teams/credit-record-response';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { TeamActivitiesRes } from '../dto/teams/team-activities-response';

@Controller('teams')
@ApiTags('teams')
@UseGuards(TokenGuard)
@ApiBearerAuth()
export class TeamsController {
    constructor(private readonly teamsService:TeamsService) {}

    @ApiOperation({
        summary: "取得球隊列表",
        description: "取得球隊列表.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiQuery({name: 'search', description: '球隊名稱關鍵字查詢', required:false})
    @Get()
    async getTeams(@Query('search') search: string, @Res() res: Response) {
        const result = await this.teamsService.getTeams(search);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "新增球隊",
        description: "新增球隊.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async createTeam(
        @Body(FormDataPipe) teamInfo: TeamCreateRequestDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res:Response
    ) {
        // Logic to create a team will go here
        const result = await this.teamsService.createTeam(teamInfo, file);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "取得球隊資訊",
        description: "取得球隊資訊.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: TeamDetailResponse,
    })
    @Get(':id')
    async getTeamDetail(@Param('id') teamId: string, @Res() res: Response) {
        // Logic to get team details will go here
        const result = await this.teamsService.getTeamDetail(teamId);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "更新球隊資訊",
        description: "更新球隊資訊.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))    
    @Put(':id')
    async updateTeam(
        @Param('id') teamId: string, 
        @Body(FormDataPipe) teamInfo: TeamUpdateRequestDto,
        @UploadedFile() file:Express.Multer.File,
        @Res() res: Response
    ) {
        // Logic to update a team will go here
        const result = await this.teamsService.updateTeam(teamId, teamInfo, file);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "上傳球隊Logo",
        description: "上傳球隊Logo.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '公告內容及上傳檔案',
        type: FileUploadDto,
    })    
    @UseInterceptors(FileInterceptor('file')) 
    @Post('logo/:id')
    async uploadTeamLogo(
        @Param('id') teamId: string,
        @Body(FileNamePipe) fileUploadDto: FileUploadDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response) {
        const result = await this.teamsService.uploadTeamLogo(teamId, file);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "新增球隊成員",
        description: "新增球隊成員.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @Post('members/:id')
    async addTeamMember(
        @Body() memberInfo: TeamMemberAddRequestDto,
        @Param('id') teamId: string,
        @Res() res: Response) {
        // Logic to add a team member will go here
        const result = await this.teamsService.addTeamMember(teamId, memberInfo);
        return res.status(HttpStatus.OK).json(result);
    }


    @ApiOperation({
        summary: "更新球隊成員",
        description: "更新球隊成員.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiParam({ name: 'id', description: '球隊 ID' })
    @ApiParam({ name: 'memberId', description: '成員 ID' })
    @Put('members/:id/:memberId')
    async updateTeamMember(
        @Body() memberInfo: TeamMemberUpdateRequestDto,
        @Param('id') teamId: string,
        @Param('memberId') memberId: string,
        @Res() res: Response) {
            const result = await this.teamsService.updateTeamMember(teamId, memberId, memberInfo);
            return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "刪除球隊成員",
        description: "刪除球隊成員.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiParam({ name: 'id', description: '球隊 ID' })
    @ApiParam({ name: 'memberId', description: '成員 ID' })
    @Delete('members/:id/:memberId')
    async deleteTeamMember(
        @Param('id') teamId: string,
        @Param('memberId') memberId: string,
        @Res() res: Response
    ){
        const result = await this.teamsService.deleteTeamMember(teamId, memberId);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "新增球隊信用評分",
        description: "新增球隊信用評分.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @Post('credit/:id')
    async updateTeamCredit(
        @Body() creditInfo: CreditRequestDto,
        @Param('id') teamId: string,
        @Req() req: any,
        @Res() res: Response,
    ){
        const result = await this.teamsService.updateTeamCredit(teamId, creditInfo, req.user);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: "查詢球隊信用評分",
        description: "查詢球隊信用評分.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CreditRecordRes,
    })
    @ApiParam({name: 'id', description: '球隊代號'})
    @Get('creditrecords/:id')
    async getCreditRecords(
        @Param('id') teamId: string,
        @Query() dates:DateRangeQueryReqDto,
        @Res() res:Response,
    ){
        const rlt = await this.teamsService.getCreditRecords(teamId, dates);
        return res.status(HttpStatus.OK).json(rlt);
    }

    @ApiOperation({
        summary: "新增球隊活動",
        description: "新增球隊活動.",
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiParam({ name: 'id', description: '球隊 ID' })
    @Post('activities/:id')
    async createTeamActivity(
        @Param('id') teamId:string,
        @Body() taCreate:TeamActivitiesCreateRequestDto,
        @Res() res:Response,
    ){
        const result = await this.teamsService.createTeamActivity(teamId, taCreate);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '更新球隊活動',
        description: '更新球隊活動',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: CommonResponseDto,
    })
    @ApiParam({name: 'id', description: '球隊ID', required: true})
    @ApiParam({name: 'activityId', description: '活動ID', required: true})
    @Put('activities/:id/:activityId')
    async modifyTeamActivity(
        @Param('id') teamId:string,
        @Param('activityId') actId:string,
        @Body() modifyAct: TeamActivitiesModifyRequestDto,
        @Res() res:Response,
    ) {
        const result = await this.teamsService.modifyTeamActivity(teamId, actId, modifyAct);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '取得活動列表',
        description: '取得活動列表',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: TeamActivitiesRes,
    })
    @ApiParam({name: 'id', description: '球隊ID', required: true})
    @Get('activities/:id')
    async getActivities(
        @Param('id') teamId: string,
        @Query() dates:DateRangeQueryReqDto,
        @Res() res:Response,
    ){
        const result = await this.teamsService.getActivities(teamId, dates);
        return res.status(HttpStatus.OK).json(result);
    }

    @ApiOperation({
        summary: '取得活動參與者列表',
        description: '取得活動參與者列表',
    })
    @ApiResponse({
        description: '成功或失敗',
        type: ActivityParticipantsResponse,
    })
    @ApiParam({name: 'activityId', description: '球隊活動ID', required: true})
    @Get('activities/participants/:activityId')
    async getActivityParticipants(
        @Param('activityId') activityId: string,
        @Res() res:Response,
    ){
        const result = await this.teamsService.getActivityParticipants(activityId);
        return res.status(HttpStatus.OK).json(result);
    }
   
}