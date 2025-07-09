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
import { DevicesModule } from './module/devices.module';
import { TeamsModule } from './module/teams.module';
import { SystemParameterModule } from './module/system-parameter.module';
import { ReservationsModule } from './module/reservations.module';
// import { InsertMembersIfNotExists } from './utils/synthetic-data/create-members';
// import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

// InsertMembersIfNotExists();

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
    AuthModule,  UsersModule, DevicesModule,  
    MembersModule,  AnnouncementsModule,  
    CouponsModule,  ReportsStatsModule,
    ReservationsModule,
    TeamsModule, SystemParameterModule ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('');
  }
}
