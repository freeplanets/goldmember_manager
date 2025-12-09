import { ApiProperty } from '@nestjs/swagger';
import { InventoryCreateReqDto } from './inventory-create-request.dto';
import { IsOptional, IsString } from 'class-validator';

export class InventoryModiReqDto extends InventoryCreateReqDto {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    unit: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    category_id: string;
}