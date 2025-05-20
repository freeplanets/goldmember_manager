import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { isUUID, ValidationError } from "class-validator";
import { ValidationException } from "../validate/validation-exception";
import { DtoErrMsg } from "../enumError";

@Injectable()
export class Uuidv1ValidationPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata) {
        if (isUUID(value)) {
            return value;
        } else {
            const error:ValidationError = {
                property: 'id',
                constraints: {
                    message: DtoErrMsg.UUID_STYLE_ERROR,
                },
                value,
            }
            throw ValidationException([error]);
        }
    }
}