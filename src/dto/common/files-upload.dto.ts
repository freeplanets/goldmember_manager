import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadDto {
    @ApiProperty({
        description: 'upload file',
        format: 'binary',
        required: false,
    })
    files: Express.Multer.File[];
}