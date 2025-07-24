import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { EventNews, EventNewsSchema } from '../dto/schemas/event-news.schema';
import { EventNewsController } from '../controller/event-news.controller';
import { EventNewsService } from '../service/event-news.service';

@Module({
    imports: [
        JwtModule,
        MongooseModule.forFeature([
            {name: LoginToken.name, schema: LoginTokenSchema},
            {name: EventNews.name, schema: EventNewsSchema}
        ])
    ],
    controllers: [ EventNewsController ],
    providers: [ EventNewsService ],
})
export class EventNewsModule {}