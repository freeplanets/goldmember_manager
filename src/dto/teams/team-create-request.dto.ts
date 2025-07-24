import { ApiProperty } from "@nestjs/swagger";
import { ITeam, ITeamPositionInfo } from "../interface/team-group.if";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import TeamPositonInfo from "./team-position-info";
import { FileUploadDto } from "../common/file-upload.dto";

export default class TeamCreateRequestDto extends FileUploadDto implements Partial<ITeam> {
    @ApiProperty({
        description: "球隊名稱",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        description: "隊長",
        required: false,
        type: TeamPositonInfo,
    })
    leader?: ITeamPositionInfo;

    @ApiProperty({
        description: "經理",
        required: false,
        type: TeamPositonInfo,
    })
    manager: ITeamPositionInfo;

    @ApiProperty({
        description: '連絡人',
        required: false,
        type:TeamPositonInfo,
    })
    contacter?: ITeamPositionInfo;

    @ApiProperty({
        description: "球隊描述",
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}