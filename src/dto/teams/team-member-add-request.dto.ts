import { TeamMemberPosition } from '../../utils/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TeamMemberAddRequestDto  {
    @ApiProperty({
        description: '會員 ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberId: string; // 會員 ID


    @ApiProperty({
        description: '聯絡電話',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone:string


    @ApiProperty({
        description: '角色',
        required: false,
        enum: TeamMemberPosition,
        example: TeamMemberPosition.MEMBER,
    })
    @IsOptional()
    @IsString()
    role?: TeamMemberPosition;

    
}