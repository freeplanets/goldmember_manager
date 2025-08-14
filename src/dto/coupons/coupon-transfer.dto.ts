import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Matches } from 'class-validator';
import { PHONE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';

export class CouponTransferDto {
    @ApiProperty({
        description: '來源ID',
        required: true,
    })
    @IsString()
    fromId: string;

    @ApiProperty({
        description: '優惠券ID',
        required: true,
    })
    @IsArray()
    couponIds: string;

    @ApiProperty({
        description: '目的ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    toId: string;

    @ApiProperty({
        description: '備註',
        required: false,
    })
    @IsOptional()
    @IsArray()
    notes:string;

}