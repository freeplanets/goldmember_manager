import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesController } from '../controller/devices.controller';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { DevicesService } from '../service/devices.service';
import { User, UserSchema } from '../dto/schemas/user.schema';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: LoginToken.name, schema: LoginTokenSchema}
        ])
    ],
    controllers:[DevicesController],
    providers:[DevicesService],
})
export class DevicesModule {}