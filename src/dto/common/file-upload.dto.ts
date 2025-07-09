import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
    @ApiProperty({
        description: 'upload file',
        format: 'binary',
        type: 'string',
        required: false,
    })
    file: Express.Multer.File;
}