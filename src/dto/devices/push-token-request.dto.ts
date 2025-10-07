import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PushTokenReqDto {
    @ApiProperty({
        description: '手機系統別(ios/android/both)',
        default: 'both',
        required: false,
        example: 'ios',
    })
    @IsOptional()
    @IsString()
    os: string;

    @ApiProperty({
        description: '手機號碼',
        required: false,
        type: String,
        isArray: true,
    })
    phone:string[];
}