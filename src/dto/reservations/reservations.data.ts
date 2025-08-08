import { MEMBER_LEVEL, ReserveFrom, ReserveStatus, ReserveType } from '../../utils/enum';
import { IReservations, IReserveHistory, IReserveSection } from '../interface/reservations.if';
import { ApiProperty } from '@nestjs/swagger';
import { ReserveSectionDto } from './reserve-section.dto';
//import { ReserveHistory } from './reserve-history';

export class ReservationsData implements IReservations {
    @ApiProperty({
        description: '預約 ID',
    })
    id:string;  //預約 ID

    @ApiProperty({
        description: '預約類型 (球隊或個人',
        enum: ReserveType,
        example: ReserveType.TEAM,
    })
    type:ReserveType;    //預約類型 (球隊或個人)

    @ApiProperty({
        description: '球隊 ID (球隊預約時使用)',
    })
    teamId:string;  //球隊 ID (球隊預約時使用)

    @ApiProperty({
        description: '球隊名稱 (球隊預約時使用)',
    })
    teamName:string;    //球隊名稱 (球隊預約時使用)

    @ApiProperty({
        description: '聯絡人姓名',
    })
    contactPerson:string;   //聯絡人姓名

    @ApiProperty({
        description: '聯絡人電話',
    })
    contactPhone:string;    //聯絡人電話

    @ApiProperty({
        description: '會員 ID (個人預約時使用)',
    })
    memberId:string;    //會員 ID (個人預約時使用)

    @ApiProperty({
        description: '會員姓名 (個人預約時使用)',
    })
    memberName:string;  //會員姓名 (個人預約時使用)

    @ApiProperty({
        description: '會員電話 (個人預約時使用)',
    })
    memberPhone:string; //會員電話 (個人預約時使用)

    @ApiProperty({
        description: '會員類型 (個人預約時使用)',
    })
    membershipType:MEMBER_LEVEL;  //會員類型 (個人預約時使用)

    @ApiProperty({
        description: '參與人數 (個人預約時使用)'
    })
    playerCount:number; //參與人數 (個人預約時使用)

    @ApiProperty({
        description: '參與人員名單 (個人預約時使用)',
    })
    participants:string;    //參與人員名單 (個人預約時使用)

    @ApiProperty({
        description: '實際參加人數',
    })
    partCount: number;

    @ApiProperty({
        description: '組數',
    })
    groups:number;  //組數

    @ApiProperty({
        description: '預約時段資料',
        type: ReserveSectionDto,
        isArray:true,
    })
    data:IReserveSection[];   //預約時段資料

    @ApiProperty({
        description: '備註',
    })
    notes:string;   //備註

    @ApiProperty({
        description: '預約狀態',
        enum: ReserveStatus,
        example: ReserveStatus.PENDING,
    })
    status:ReserveStatus;  //預約狀態

    @ApiProperty({
        description: '建立時間',
    })
    createdAt:string;   //($date-time)建立時間

    @ApiProperty({
        description: '預約來源',
        enum: ReserveFrom,
        example: ReserveFrom.APP,
    })
    reservedFrom:ReserveFrom;    //預約來源

    @ApiProperty({
        description: '預約歷史記錄',
        //type: ReserveHistory,
        isArray: true,
    })
    history:IReserveHistory[];  
}