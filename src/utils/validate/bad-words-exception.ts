import { BadRequestException } from "@nestjs/common";
import { ErrCode } from "../enumError";
import { CommonResponseDto } from "../../dto/common/common-response.dto";

export const BadWordsException = (errorcode:ErrCode) => {
    // const newErrors:Record<string, unknown> = {
    //     errorcode: ErrCode.ERROR_PARAMETER,
    // };
    const newErrors:CommonResponseDto = new CommonResponseDto();
    newErrors.ErrorCode = errorcode;
    //BadRequestException(objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions)
    return new BadRequestException(newErrors);
}


