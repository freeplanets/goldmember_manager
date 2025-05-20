import { ApiProperty } from '@nestjs/swagger';
import { IMemberTransferLog } from '../interface/member.if';
import { MEMBER_LEVEL } from '../../utils/enum';

export class MemberTransferLogData implements IMemberTransferLog {
    @ApiProperty({
        description: '會員名稱',
        required: false,
    })
    id: string;

    @ApiProperty({
        description: '會員名稱',
        required: false,
    })
    memberName: string;

    @ApiProperty({
        description: '會員內部編號',
        required: false,
    })
    memberId: string;

    @ApiProperty({
        description: '舊會員等級',
        required: false,
    })
    oldMembershipType?: MEMBER_LEVEL;

    @ApiProperty({
        description: '新會員等級',
        required: false,
    })
    newMembershipType?: MEMBER_LEVEL;

    @ApiProperty({
        description: '是否為董事',
        required: false,
    })
    isDirector?: boolean;

    @ApiProperty({
        description: '修改時間',
        required: false,
    })
    modifiedAt?: number;

    @ApiProperty({
        description: '修改人員',
        required: false,
    })
    modifiedByWho: string;
    @ApiProperty({
        description: '修改人員ID',
        required: false,
    })
    modifiedBy?: string;
    
}