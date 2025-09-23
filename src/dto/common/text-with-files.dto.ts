import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilesUploadDto } from './files-upload.dto';

export class TextWithFile extends FilesUploadDto {
    @ApiProperty({
        description: '要檢查的文字',
        required: false,
    })
    @IsOptional()
    @IsString()
    text: string;
}