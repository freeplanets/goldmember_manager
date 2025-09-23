import { ApiProperty } from '@nestjs/swagger';
import { FileUploadDto } from './file-upload.dto';
import { IsOptional, IsString } from 'class-validator';

export class TextWithFile extends FileUploadDto {
    @ApiProperty({
        description: '要檢查的文字',
        required: false,
    })
    @IsOptional()
    @IsString()
    text: string;
}