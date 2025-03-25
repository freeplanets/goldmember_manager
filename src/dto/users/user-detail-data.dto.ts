import { ApiProperty } from "@nestjs/swagger";
import { UserBaseDataDto } from "./user-base-data.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UserDetailDataDto extends UserBaseDataDto {
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
        description: '電子郵件',
        required: false,
        example: 'example@email.com'
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({
        description: '是否啟用',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        description: '最後登入時間',
        required: false,
        example: '',
    })
    @IsOptional()
    @IsString()
    lastLogin?: string;

    @ApiProperty({
        description: '最後登入ip',
        required: false,
        example: '192.168.200.200',
    })
    @IsOptional()
    @IsString()
    lastLoginIp?: string;
}