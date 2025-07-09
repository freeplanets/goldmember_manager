import { TeamMemberPosition } from '../../utils/enum';
import { ITeamMember } from '../interface/team-group.if';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TeamMemberAddRequestDto implements Partial<ITeamMember> {
    @ApiProperty({
        description: '會員 ID',
        required: false,
    })
    memberId: string; // 會員 ID

    @ApiProperty({
        description: '會員名稱',
        required: true,
    })
    @IsString()
    name: string; // 會員姓名

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
        description: '電話',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string; // 電話
}