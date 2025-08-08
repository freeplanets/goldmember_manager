import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { UUID_V4_STYLE } from '../../utils/constant';

export class CouponUseReqDto {
    @ApiProperty({
        description: '優惠券代號',
        required: true,
        type:String,
        isArray: true,
    })
    @Matches(UUID_V4_STYLE, {each: true})
    id:string[];

    @ApiProperty({
        description: '優惠券使用備註',
        required: false,
    })
    @IsOptional()
    @IsString()
    notes: string;
}