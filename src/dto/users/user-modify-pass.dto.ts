import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { PASSWORD_STYLE } from "../../utils/constant";
import { DtoErrMsg } from "../../utils/enumError";

export class UserModifyPassDto {
    @ApiProperty({
        description: '舊密碼',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    oldPassword:string

    @ApiProperty({
        description: '新密碼',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Matches(PASSWORD_STYLE, {message: DtoErrMsg.PASSWORD_STYLE_ERROR})
    newPassword:string;
}