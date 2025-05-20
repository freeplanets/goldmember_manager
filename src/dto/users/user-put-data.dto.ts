import { ApiProperty } from "@nestjs/swagger";
import { UserBaseDataDto } from "./user-base-data.dto";
import { IsOptional, IsString } from "class-validator";

export class UserPutDataDto extends UserBaseDataDto {
    @ApiProperty({
        description: '電話/手機',
        required: false,
        example: '0922123456',
    })
    @IsOptional()
    @IsString()
    phone?: string;
}