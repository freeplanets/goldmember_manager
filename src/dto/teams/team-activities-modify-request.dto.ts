import { ApiProperty } from '@nestjs/swagger';
import { TeamActivitiesCreateRequestDto } from './team-activities-create-request.dto';
import { IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class TeamActivitiesModifyRequestDto extends TeamActivitiesCreateRequestDto {
    @ApiProperty({
        description: '活動標題',
        example: '團隊建設活動',
        required: false,
    })
    @IsOptional()
    @IsString()
    title: string; //標題

    @ApiProperty({
        description: '活動日期',
        example: '2023/10/01',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    date:string;    //日期

    @ApiProperty({
        description: '報名開始日期',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR}) 
    registrationStart: string;  // 報名開始日期
}