import { TeamActivityStatus } from '../../utils/enum';
import { ITeamActivity } from '../interface/team-group.if';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class TeamActivitiesCreateRequestDto implements Partial<ITeamActivity> {
    @ApiProperty({
        description: '活動標題',
        example: '團隊建設活動',
        required: true,
    })
    @IsString()
    title: string; //標題

    @ApiProperty({
        description: '活動描述',
        example: '這是一個團隊建設活動，旨在增強團隊凝聚力。',
        required: false,
    })
    @IsOptional()
    @IsString()
    description: string; //描述

    @ApiProperty({
        description: '活動日期',
        example: '2023/10/01',
        required: true,
    })
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    date:string;    //日期

    @ApiProperty({
        description: '地點',
        required: false,
    })
    @IsOptional()
    @IsString()
    location: string;   //地點

    @ApiProperty({
        description: '報名開始日期',
        required: true,
    })
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR}) 
    registrationStart: string;  // 報名開始日期

    @ApiProperty({
        description: '報名結束日期',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    registrationEnd: string;    //報名結束日期

    @ApiProperty({
        description: '最大參與人數',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    maxParticipants: number; //最大參與人數

    @ApiProperty({
        description: '狀態',
        enum: TeamActivityStatus,
        example: TeamActivityStatus.UPCOMING,
        required: false,
    })
    @IsOptional()
    @IsString()
    status:	TeamActivityStatus; //狀態
}
    