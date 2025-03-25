import { ApiProperty } from "@nestjs/swagger";
import { IAttachmemt } from "../interface/announcement.if";
import { IsString } from "class-validator";

export class Attachment implements IAttachmemt {
    @ApiProperty({
        description: '檔案名稱',
    })
    @IsString()
    name?: string;

    @ApiProperty({
        description: '檔案連結'
    })
    @IsString()
    url?: string;

    @ApiProperty({
        description: '檔案大小'
    })
    size?: number;    
}