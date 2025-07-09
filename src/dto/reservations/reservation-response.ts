import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IReservations } from '../interface/reservations.if';
import { ReservationsData } from './reservations.data';

export class ReservationResponse extends CommonResponseDto implements ICommonResponse<IReservations>{
    @ApiProperty({
        description: '預約資訊',
        type: ReservationsData,
        isArray: true,
    })
    data?: IReservations;
}