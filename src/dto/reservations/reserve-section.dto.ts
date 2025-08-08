import { CourseName, TimeSectionType } from '../../utils/enum';
import { IReserveSection } from '../interface/reservations.if';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Matches } from 'class-validator';
import { DATE_STYLE, TIME_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class ReserveSectionDto implements Partial<IReserveSection> {
    @ApiProperty({
        description: '日期 (YYYY/MM/DD)',
        required: true,
    })
    @IsString()
    @Matches(DATE_STYLE, {message: DtoErrMsg.DATE_STYLE_ERROR})
    date:string;    //($date)日期 (YYYY/MM/DD)

    @ApiProperty({
        description: '時段 (HH:MM)',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(TIME_STYLE, {message: DtoErrMsg.TIME_STYLE_ERROR})
    timeSlot:string;    //時段 (HH:MM)

    @ApiProperty({
        description: '開始時間 (HH:MM)',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(TIME_STYLE, {message: DtoErrMsg.TIME_STYLE_ERROR})
    startTime:string;   //開始時間 (HH:MM)

    @ApiProperty({
        description: '結束時間 (HH:MM)',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(TIME_STYLE, {message: DtoErrMsg.TIME_STYLE_ERROR})    
    endTime:string; //結束時間 (HH:MM)

    @ApiProperty({
        description: '球道',
        required: false,
        enum: CourseName,
        example: CourseName.EAST,
    })
    @IsOptional()
    @IsString()
    course:CourseName;  //球道

    @ApiProperty({
        description: '球道列表 (時間範圍預約時使用)',
        required: false,
        enum: CourseName,
        isArray: true,
        example: [CourseName.EAST],
    })
    @IsOptional()
    @IsArray()
    courses:CourseName[];    // 球道列表 (時間範圍預約時使用)

    @ApiProperty({
        description: '時段類型 (單一時段或時間範圍)',
        required: true,
        enum: TimeSectionType,
        example: TimeSectionType.TIMESLOT,
    })
    @IsString()
    type:TimeSectionType;    //時段類型 (單一時段或時間範圍)
}