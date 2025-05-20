import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CouponTransferLogReqDto {
    @ApiProperty({
        description: '優惠券ID',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    couponId: string;

    @ApiProperty({
        description: '會員名稱',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberName: string;

    @ApiProperty({
        description: '會員ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberId: string;
}