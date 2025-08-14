import { ApiProperty } from "@nestjs/swagger";
import { IInvitationCode } from "../interface/ks-member.if";

export class InvitationCodeDta implements Partial<IInvitationCode> {
    @ApiProperty({
        description: '會員編號',
    })
    no:string;

    @ApiProperty({
        description: '會員名稱',
    })
    name:string;

    @ApiProperty({
        description: '邀請碼',
    })
    code:string;

    @ApiProperty({
        description: '是否已使用',
    })
    isCodeUsed: boolean;

    @ApiProperty({
        description: '已使用時間戳(timestamp)',
    })
    CodeUsedTS: number;    
}