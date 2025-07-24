import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { ICreditRecord } from "../interface/team-group.if";
import { CreditRecordData } from "./credit-record.data";

export class CreditRecordRes extends CommonResponseDto implements ICommonResponse<Partial<ICreditRecord>[]> {
    @ApiProperty({
        description: '信用記錄',
        type: CreditRecordData,
        isArray: true,
    })
    data?: Partial<ICreditRecord>[];
}