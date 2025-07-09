import { Module } from '@nestjs/common';
import { ReservationsController } from '../controller/reservations.controller';
import { ReservationsService } from '../service/reservations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservations, ReservationsSchema } from '../dto/schemas/reservations.schema';
import { ReserveSection, ReserveSectionSchema } from '../dto/schemas/reserve-section.schema';
import { JwtModule } from '@nestjs/jwt';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';


@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: Reservations.name, schema: ReservationsSchema},
            {name: ReserveSection.name, schema: ReserveSectionSchema},
            {name: LoginToken.name, schema: LoginTokenSchema},
        ])
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService],
})
export class ReservationsModule {}