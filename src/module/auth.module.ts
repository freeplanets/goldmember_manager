import { Global, Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../dto/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { TempData, TempDataSchema } from '../dto/schemas/tempdata.schema';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { MemberActivity, MemberActivitySchema } from '../dto/schemas/member-activity.schema';

@Global()
@Module({
  imports: [
    // SessionModule.forRoot({
    //   session: { secret: process.env.SESSION_SECRET }
    // }),
    ConfigModule.forRoot({
      load: [jwtConfig]
    }),    
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret.jwt'),
        signOptions: {
          mutatePayload: true,
          expiresIn: '1h',
        }
      }),
    }),
    MongooseModule.forFeature([
      {name: User.name, schema:UserSchema},
      {name: TempData.name, schema: TempDataSchema},
      {name: LoginToken.name, schema: LoginTokenSchema},
      {name: MemberActivity.name, schema: MemberActivitySchema}
    ]),
    // GoogleRecaptchaModule.forRoot({
    //   secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
    //   response: req => req.headers.recaptcha,
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  // exports: [JwtModule]
})
export class AuthModule {}
