import { ApiProperty } from "@nestjs/swagger";
import { MemberBaseDataDto } from "./member-base-data.dto";
import { IsOptional, IsString } from "class-validator";
import { DS_LEVEL, MEMBER_LEVEL } from "../../utils/enum";

export class MemberListDataDto extends MemberBaseDataDto{
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
        enum: DS_LEVEL,
        example: DS_LEVEL.NONE,
    })
    @IsOptional()
    @IsString()
    isDirector?: DS_LEVEL;

}