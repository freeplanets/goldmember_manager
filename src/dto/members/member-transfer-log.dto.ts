import { ApiProperty } from '@nestjs/swagger';
import { IMemberTransferLog } from '../interface/member.if';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class MemberTransferLogDto implements Partial<IMemberTransferLog> {
    @ApiProperty({
        description: '會員名稱',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberName?: string;

    @ApiProperty({
        description: '會員內部編號',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    memberId?: string;
}
    