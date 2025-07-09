import { ApiProperty } from '@nestjs/swagger';
import { ITeamPositionInfo } from '../interface/team-group.if';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class TeamPositonInfo implements ITeamPositionInfo {
    @ApiProperty({
        description: 'ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        description: '姓名',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: '電話',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    phone: string;
}