import { Module } from '@nestjs/common';
import { AnnouncementsController } from '../controller/announcements.controller';
import { AnnouncementsService } from '../service/announcements.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from '../dto/schemas/announcement.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{name: Announcement.name,  schema: AnnouncementSchema}])
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
})
export class AnnouncementsModule {}
