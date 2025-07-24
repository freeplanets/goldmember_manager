import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { Pendings } from "./pending.data";

export class PendingAllResponse extends CommonResponseDto implements ICommonResponse<Pendings> {
    @ApiProperty({
        description: '待辦事項'
    })
    data?: Pendings;
}