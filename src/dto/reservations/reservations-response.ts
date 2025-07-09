import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IReservations } from '../interface/reservations.if';
import { ReservationsData } from './reservations.data';

export class ReservationsResponse extends CommonResponseDto implements ICommonResponse<IReservations[]>{
    @ApiProperty({
        description: '預約列表',
        type: ReservationsData,
        isArray: true,
    })
    data?: IReservations[];
}