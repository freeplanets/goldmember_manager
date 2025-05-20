import { BadRequestException } from "@nestjs/common";
import { isObject, ValidationError } from "class-validator";
import { ErrCode } from "../enumError";
import { IValidationError } from "./validation-if";
import { CommonResponseDto } from "../../dto/common/common-response.dto";

export const ValidationException = (errors: ValidationError[]) => {
    // const newErrors:Record<string, unknown> = {
    //     errorcode: ErrCode.ERROR_PARAMETER,
    // };
    const newErrors:CommonResponseDto = new CommonResponseDto();
    newErrors.ErrorCode = ErrCode.ERROR_PARAMETER;
    const extra = {};
    Object.keys(errors).forEach((key) => {
        if (isObject(errors[key])) {
            // extra[key] = errors[key]; 
            const obj= errors[key] as IValidationError;
            extra[obj.property] = { ...obj.constraints };
            extra[obj.property].value = obj.value;
        }
    })
    newErrors.error.extra = extra;
    //BadRequestException(objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions)
    return new BadRequestException(newErrors);
}


