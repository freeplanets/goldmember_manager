import { ApiProperty } from "@nestjs/swagger";
import { UserBaseDataDto } from "./user-base-data.dto";
import { IsOptional, IsString, Matches } from "class-validator";
import { PASSWORD_STYLE, PHONE_STYLE, USERNAME_STYPE } from "../../utils/constant";
import { DtoErrMsg, ErrCode } from "../../utils/enumError";
export class UserCreateDataDto extends UserBaseDataDto {
    @ApiProperty({
        description: '使用者名稱(長度6~15個字元)',
        required: true,
        example: 'james',
    })
    @IsString()
    @Matches(USERNAME_STYPE, {message: DtoErrMsg.USERNAME_STYLE_ERROR})
    username: string;

    @ApiProperty({
        description: '電話/手機',
        required: false,
        example: '0922123456',
    })
    @IsOptional()
    @IsString()
    @Matches(PHONE_STYLE, {message: DtoErrMsg.PHONE_STYLE_ERROR})
    phone?: string;

    @ApiProperty({
        description: '使用者密碼(長度6~15個字元),至少各有一個數字，小寫英文及大寫英文\n\n登入使用者名稱和密碼可使用下列字元。名稱和密碼區分大小寫。\n\n大寫字母：A到Z（26個字元）\n\n小寫字母：a到z（26個字元）\n\n數字：0到9（10個字元）\n\n符號：（空格） !" # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _` { | } ~ （33個字元）',
        required: true,
        example: '12aBc3'
    })
    @IsString()
    @Matches(PASSWORD_STYLE,{message: DtoErrMsg.PASSWORD_STYLE_ERROR})
    password?: string;
}