import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';
import { AuthModule} from './module/auth.module';
import { UsersModule } from './module/users.module';
import { MembersModule} from './module/members.module';
import { AnnouncementsModule} from './module/announcements.module';
import { CouponsModule} from './module/coupons.module';
import { ReportsStatsModule} from './module/reports_stats.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
// import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

let dbase = process.env.MONGO_DB;
if (process.env.IS_OFFLINE) dbase = process.env.LMONGO_DB;

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mongoConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
        directConnection: true,
        dbName: dbase,
        connectTimeoutMS: 5000,
        //timeoutMS: 5000,
      })
    }),
    // MongodbModule,
     AuthModule,  UsersModule,  MembersModule,  AnnouncementsModule,  CouponsModule,  ReportsStatsModule, ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('');
  }
}
