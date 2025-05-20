import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { MemberTransferLogData } from './member-transfer-log';

export class MemberTransferLogRes extends CommonResponseDto implements ICommonResponse<MemberTransferLogData[]> {
    @ApiProperty({
        description: '會員轉會紀錄',
        required: false,
        type: MemberTransferLogData,
        isArray: true,
    })
    data: MemberTransferLogData[];
} 