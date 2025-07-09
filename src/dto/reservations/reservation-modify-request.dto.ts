import { ApiProperty } from "@nestjs/swagger";
import { IReservations, IReserveSection } from "../interface/reservations.if";
import { ReserveSectionDto } from "./reserve-section.dto";
import { ReserveStatus } from "src/utils/enum";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class ReservationModifyRequestDto implements Partial<IReservations> {
    @ApiProperty({
        description: '聯絡人姓名',
        required: false,
    })
    @IsOptional()
    @IsString()
    contactPerson?: string;

    @ApiProperty({
        description: '聯絡人電話',
        required:false,
    })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiProperty({
        description: '參與人數 (個人預約時使用)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    playerCount?: number;

    @ApiProperty({
        description: '參與人員名單 (個人預約時使用)',
        required: false,
    })
    @IsOptional()
    @IsString()
    participants?: string;

    @ApiProperty({
        description: '組數',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    groups?: number;

    @ApiProperty({
        description: '預約時段資料',
        type: ReserveSectionDto,
        isArray:true,
        required: false,
    })
    @IsOptional()
    @IsArray()
    data?: IReserveSection[];

    @ApiProperty({
        description: '備註',
        required: false,
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({
        description: '預約狀態',
        enum: ReserveStatus,
        example: ReserveStatus.PENDING,
        required: false,
    })
    @IsOptional()
    @IsString()
    status?: ReserveStatus;
}