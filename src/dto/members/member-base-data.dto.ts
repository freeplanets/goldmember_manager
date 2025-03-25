import { ApiProperty } from "@nestjs/swagger";
import { IMember } from "../interface/member.if";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { GENDER } from "../../utils/enum";

export class MemberBaseDataDto implements Partial<IMember> {
    @ApiProperty({
        description: '會員內部編號',
        required: false,
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        description: '會員名稱',
        required: false,
        example: '李大偉',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: '會員顯示名稱',
        required: false,
        example: 'david',
    })
    @IsOptional()
    @IsString()
    displayName?: string;

    @ApiProperty({
        description: '性別',
        required: false,
        enum: GENDER,
        example: GENDER.MALE,
    })
    @IsOptional()
    @IsString()
    gender?: GENDER;

    @ApiProperty({
        description: '生日',
        required: false,
    })
    @IsOptional()
    @IsString()
    birthDate?: string;

    @ApiProperty({
    description: '差點',
    required: false,
    })
    @IsOptional()
    @IsNumber()
    handicap?: number;

    @ApiProperty({
        description: '會員頭像，自選或上傳',
        required: false,
    })
    @IsOptional()
    @IsString()
    pic?: string;

    @ApiProperty({
        description: '手機種類',
        required: false,
    })
    mobileType?: string;

    @ApiProperty({
        description: 'app 安裝序號',
        required: false,
    })
    mobileId?: string;

    
}