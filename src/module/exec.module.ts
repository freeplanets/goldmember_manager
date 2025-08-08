import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExecController } from '../controller/exec.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { KsMember, KsMemberSchema } from '../dto/schemas/ksmember.schema';
import { ExecService } from '../service/exec.service';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: LoginToken.name, schema: LoginTokenSchema},
            {name: KsMember.name, schema: KsMemberSchema},
        ])        
    ],
    controllers: [ExecController],
    providers: [ExecService]
})
export class ExecModuel {}