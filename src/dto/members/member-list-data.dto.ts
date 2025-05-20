import { ApiProperty } from "@nestjs/swagger";
import { MemberBaseDataDto } from "./member-base-data.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { DS_LEVEL, MEMBER_LEVEL } from "../../utils/enum";
import { IMember } from "../interface/member.if";

export class MemberListDataDto extends MemberBaseDataDto implements Partial<IMember>{
    @ApiProperty({
        description: '會員型式',
        required: false,
        enum: MEMBER_LEVEL,
        example: MEMBER_LEVEL.GENERAL_MEMBER,
    })
    @IsOptional()
    @IsString()
    membershipType?: MEMBER_LEVEL;

    @ApiProperty({
        description: '董監事註記',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isDirector?: boolean;

    @ApiProperty({
        description: '是否非手機 app 會員',
        required: false,
    })   
    isNotAppMember?: boolean;
}