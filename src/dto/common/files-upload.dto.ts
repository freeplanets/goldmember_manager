import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: true,
    })
    files: any;
}