import { Module } from '@nestjs/common';
import { MembersController } from '../controller/members.controller';
import { MembersService } from '../service/members.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../dto/schemas/member.schema';
import { JwtModule } from '@nestjs/jwt';
import { KsMember, KsMemberSchema } from '../dto/schemas/ksmember.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {name:Member.name, schema:MemberSchema},
      {name:KsMember.name, schema:KsMemberSchema},
    ])
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
