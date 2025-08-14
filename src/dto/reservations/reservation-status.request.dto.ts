import { ReserveStatus } from '../../utils/enum';
import { IReservations } from '../interface/reservations.if';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReservationStatusRequestDto implements Partial<IReservations> {
    @ApiProperty({
        description: '預約狀態',
        enum: ReserveStatus,
        example: ReserveStatus.CONFIRMED,
    })
    @IsString()
    status?: ReserveStatus;
    
    @ApiProperty({
        description: '預約狀態變更原因',
        required: false,
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({
        description: '原預約球隊ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    teamId?: string;

    @ApiProperty({
        description: '原預約會員ID',
        required: false,
    })
    @IsOptional()
    @IsString()
    memberId?: string;
}