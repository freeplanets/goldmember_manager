import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { IReservationParticipant } from "../interface/reservations.if";
import { ParticipantData } from "./participant.data";

export class ParticipantsResponse extends CommonResponseDto implements ICommonResponse<Partial<IReservationParticipant>[]> {
    @ApiProperty({
        description: '參加者列表',
        type: ParticipantData,
        isArray: true,
    })
    data?: Partial<IReservationParticipant>[];
}