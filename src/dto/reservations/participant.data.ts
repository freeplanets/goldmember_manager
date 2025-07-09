import { ParticipantStatus } from '../../utils/enum';
import { IReservationParticipant } from '../interface/reservations.if';
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantData implements Partial<IReservationParticipant> {
    @ApiProperty({
        description: '參與者 會員ID'
    })
    id:	string; //參與者 ID

    @ApiProperty({
        description: '參與者姓名',
    })
    name: string;   //參與者姓名

    @ApiProperty({
        description: '參與者電話'
    })
    phone: string;  //參與者電話

    @ApiProperty({
        description: '會員類型'
    })
    membershipType:	string; //會員類型

    @ApiProperty({
        description: '報名日期',
    })
    registrationDate: string;   //($date)報名日期

    @ApiProperty({
        description: '報名狀態',
        enum: ParticipantStatus,
        example: ParticipantStatus.PENDING,
    })
    status:	ParticipantStatus; //報名狀態 Enum: [ confirmed, pending, cancelled ]  
}