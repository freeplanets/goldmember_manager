import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { RefreshTokenData } from "./refresh-token-data";

export class AuthRefreshTokenResponse extends CommonResponseDto implements ICommonResponse<RefreshTokenData> {
    @ApiProperty({
        description: 'token',
        type: RefreshTokenData,
    })
    data?: RefreshTokenData;
}