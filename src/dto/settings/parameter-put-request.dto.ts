import { ApiProperty } from '@nestjs/swagger';
import { IParameter } from '../../utils/settings/settings.if';
import { AnyObject } from '../interface/common.if';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class ParameterPutReq implements Partial<IParameter<AnyObject>> {
    @ApiProperty({
        description: '參數 key',
        example: 'NOTIFICATION',
        required: false,
    })
    @IsOptional()
    @IsString()
    key?: string;

    @ApiProperty({
        description: '參數值(物件)',
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsObject()
    value?: AnyObject;

    @ApiProperty({
        description: '參數說明',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}