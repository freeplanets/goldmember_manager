import { ApiProperty } from "@nestjs/swagger";
import { UserBaseDataDto } from "./user-base-data.dto";
import { IsOptional, IsString } from "class-validator";

export class UserCreateDataDto extends UserBaseDataDto {
    @ApiProperty({
        description: '使用者編號',
        required: false,
        example: '',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        description: '電話/手機',
        required: false,
        example: '0922123456',
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: '使用者密碼',
        required: false,
        example: '**********'
    })
    @IsOptional()
    @IsString()
    password?: string;
}