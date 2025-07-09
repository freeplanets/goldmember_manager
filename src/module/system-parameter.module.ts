import { Module } from '@nestjs/common';
import { SystemParameterController } from '../controller/system-parameter.controller';
import { SystemParameterService } from '../service/system-parameter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemParameter, SystemParameterSchema } from '../dto/schemas/system-parameter.schema';
import { JwtModule } from '@nestjs/jwt';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';


@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            { name: SystemParameter.name, schema: SystemParameterSchema },
            { name: LoginToken.name, schema: LoginTokenSchema },
        ]),
    ],
    controllers: [SystemParameterController],
    providers: [SystemParameterService],
})
export class SystemParameterModule {}