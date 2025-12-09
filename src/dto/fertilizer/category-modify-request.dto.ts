import { ApiProperty } from '@nestjs/swagger';
import { IInventoryCategory } from '../interface/fertilizer.if';
import { IsString } from 'class-validator';

export class CategoryModifyReqDto implements Partial<IInventoryCategory> {
    @ApiProperty({
        description: '品名',
        required: true,
    })
    @IsString()
    name?: string;
}