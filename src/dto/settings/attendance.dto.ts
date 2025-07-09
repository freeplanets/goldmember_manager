import { ApiProperty } from '@nestjs/swagger';
import { IAttendance } from '../../utils/settings/settings.if';
import { IsOptional, IsString } from 'class-validator';

export class AttendanceDto implements IAttendance {
    @ApiProperty({
        description: '準時獎勵分數',
        required: false,
        example: '10'
    })
    @IsOptional()
    @IsString()
    on_time_bonus: string;  //'10', 準時獎勵分數

    @ApiProperty({
        description: '遲到懲罰分數',
        required: false,
        example: '-10'
    })
    @IsOptional()
    @IsString()
    late_penalty: string;   //'-10', 遲到懲罰分數

    @ApiProperty({
        description: '取消預約懲罰分數',
        required: false,
        example: '-15'
    })
    @IsOptional()
    @IsString()
    cancel_penalty: string; //'-15', 取消預約懲罰分數

    @ApiProperty({
        description: '未出席懲罰分數',
        required: false,
        example: '-20'
    })
    @IsOptional()
    @IsString()
    no_show_penalty: string;    //'-20', 未出席懲罰分數
}