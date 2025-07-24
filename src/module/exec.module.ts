import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExecController } from '../controller/exec.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: LoginToken.name, schema: LoginTokenSchema},
        ])        
    ],
    controllers: [ExecController]
})
export class ExecModuel {}