import { Prop, Schema } from '@nestjs/mongoose';
import { IReservationParticipant } from '../interface/reservations.if';
import mongoose from 'mongoose';
import { ParticipantStatus } from '../../utils/enum';

@Schema()
export class Participant implements Partial<IReservationParticipant> {
    @Prop({
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Member',
        select: 'id name phone membershipType',
    })
    member: string; // Member ObjectId

    @Prop()
    registrationDate?: string;

    @Prop({
        enum: ParticipantStatus,
        default: ParticipantStatus.PENDING,
    })
    status?: ParticipantStatus;
}