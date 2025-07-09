import { ApiProperty } from '@nestjs/swagger';
import { ITeamMember } from '../interface/team-group.if';
import { TeamMemberPosition } from '../../utils/enum';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TeamMemberUpdateRequestDto implements Partial<ITeamMember> {
    @ApiProperty({
        description: '角色',
        required: false,
        enum: TeamMemberPosition,
        example: TeamMemberPosition.MEMBER,
    })
    @IsOptional()
    @IsString()
    role?: TeamMemberPosition;

    @ApiProperty({
        description: '是否活躍',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean; // 是否活躍
}
    
    
    
    