import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { IInvitationCode } from "../interface/ks-member.if";
import { InvitationCodeDta } from "./invitation-codes-data";

export class InvitationCodeRes extends CommonResponseDto implements ICommonResponse<Partial<IInvitationCode>> {
    @ApiProperty({
        description: '邀請碼列表',
        type: InvitationCodeDta,
        isArray: true,
    })
    data?: Partial<IInvitationCode>;
}