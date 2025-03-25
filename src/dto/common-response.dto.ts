import { ApiProperty } from "@nestjs/swagger";
import { ICommonError, ICommonResponse } from "./interface/common.if";
import { ErrCode } from "../utils/enumError";
import { CommonErrorDto } from "./common-error.dto";

export class CommonResponseDto implements ICommonResponse<any> {
    constructor(code?:ErrCode){
        this.errorcode = !code ? ErrCode.OK : code;
    }
    @ApiProperty({
        description: '錯誤代碼',
        enum: ErrCode,
        example: ErrCode.OK,
    })
    errorcode: ErrCode;

    @ApiProperty({
        description: '當有錯時顯示錯誤訊息',
        type: CommonErrorDto,
    })
    error?: ICommonError;
}