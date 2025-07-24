import { TeamStatus } from '../../utils/enum';
import TeamCreateRequestDto from './team-create-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TeamUpdateRequestDto extends TeamCreateRequestDto {
    @ApiProperty({
        description: "球隊名稱",
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '球隊狀態',
        required: false,
        enum: TeamStatus,
        example: TeamStatus.ACTIVE,
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    status?: TeamStatus; // 球隊狀態
}
    
    