import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IAttendance, IGrading } from '../../utils/settings/settings.if';
import { AttendanceDto } from './attendance.dto';

export class GradingDto implements IGrading {
    @ApiProperty({
        description: '初始分數',
        required: false,
        example: '100',
    })
    @IsOptional()
    @IsString()
    initial_score: string;  //'100',   初始分數

    @ApiProperty({
        description: '正確球員獎勵分數',
        required: false,
        example: '5'
    })
    @IsOptional()
    @IsString()
    correct_players_bonus: string; //'5', 正確球員獎勵分數

    @ApiProperty({
        description: '評分方式',
        required: false,
        type: AttendanceDto,
    })
    @IsOptional()
    @IsString()
    attendance: IAttendance;
}