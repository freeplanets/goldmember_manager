import { ReserveType } from '../../utils/enum';
import { IReservationParticipant, IReservations, IReserveSection } from '../interface/reservations.if';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsPassportNumber, IsString, IsUUID } from 'class-validator';
import { ReserveSectionDto } from './reserve-section.dto';

export class ReservationCreateRequestDto implements Partial<IReservations> {
    @ApiProperty({
        description: '預約類型 (球隊或個人',
        enum: ReserveType,
        example: ReserveType.TEAM,
    })
    @IsString()
    type?: ReserveType;

    @ApiProperty({
        description: '球隊 ID (球隊預約時使用)',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    teamId?: string;

    @ApiProperty({
        description: '會員 ID (個人預約時使用)',
        required: false,
    })
    @IsOptional()
    @IsUUID()
    memberId?: string;

    @ApiProperty({
        description: '聯絡人姓名',
    })
    @IsOptional()
    @IsString()
    contactPerson?: string;

    @ApiProperty({
        description: '聯絡人電話',
    })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiProperty({
        description: '參與人數 (個人預約時使用)'
    })
    @IsOptional()
    @IsNumber()
    playerCount?: number;

    @ApiProperty({
        description: '參與人員名單 (個人預約時使用)',
    })
    @IsOptional()
    participants?: string | IReservationParticipant[];

    @ApiProperty({
        description: '組數',
    })
    @IsOptional()
    @IsNumber()
    groups?: number;

    @ApiProperty({
        description: '預約時段資料',
        type: ReserveSectionDto,
        isArray:true,
    })
    @IsArray()
    data?: IReserveSection[];

    @ApiProperty({
        description: '備註',
        required: false,
    })
    @IsOptional()
    @IsString()
    notes?: string;
}