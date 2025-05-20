import { UnauthorizedException } from "@nestjs/common";
import { ErrCode } from "../enumError";
import { CommonResponseDto } from "../../dto/common/common-response.dto";

export const TokenErrorException = (errcode:ErrCode) => {
    // const newErrors:Record<string, unknown> = {
    //     errorcode: ErrCode.TOKEN_ERROR,
    // };
    const newErrors:CommonResponseDto = new CommonResponseDto();
    newErrors.ErrorCode = errcode;
    return new UnauthorizedException(newErrors);
}
    