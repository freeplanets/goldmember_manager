import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { LoginDevice } from "./login-device";
import { ILoginDevice } from "../interface/devices.if";

export class DevicesResponse extends CommonResponseDto implements ICommonResponse<Partial<ILoginDevice>[]> {
    @ApiProperty({
        description: '使用者登入設備列表',
        type: LoginDevice,
        isArray: true,
    })
    data?: Partial<ILoginDevice>[];
}