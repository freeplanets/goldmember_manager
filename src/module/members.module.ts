import { Module } from '@nestjs/common';
import { MembersController } from '../controller/members.controller';
import { MembersService } from '../service/members.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../dto/schemas/member.schema';
import { JwtModule } from '@nestjs/jwt';
import { KsMember, KsMemberSchema } from '../dto/schemas/ksmember.schema';
import { LoginToken, LoginTokenSchema } from '../dto/schemas/login-token.schema';
import { MemberGrowth, MemberGrowthSchema } from '../dto/schemas/member-growth.schema';
import { MemberTransferLog, MemberTransferLogSchema } from '../dto/schemas/member-transfer-log.schema';
import { Coupon, CouponSchema } from '../dto/schemas/coupon.schema';
import { CreditRecord, CreditRecordSchema } from '../dto/schemas/credit-record.schema';
import { InvitationCode, InvitationCodeSchema } from '../dto/schemas/invitation-code.schema';
import { Team, TeamSchema } from '../dto/schemas/team.schema';
import { TeamMember, TeamMemberSchema } from '../dto/schemas/team-member.schema';
import { Friend, FriendSchema } from '../dto/schemas/friend.schema';
import { PushToken, PushTokenSchema } from '../dto/schemas/push-token.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {name:Member.name, schema:MemberSchema},
      {name:KsMember.name, schema:KsMemberSchema},
      {name:LoginToken.name, schema:LoginTokenSchema},
      {name:MemberGrowth.name, schema:MemberGrowthSchema},
      {name:MemberTransferLog.name, schema:MemberTransferLogSchema},
      {name:Coupon.name, schema: CouponSchema},
      {name:CreditRecord.name, schema: CreditRecordSchema},
      {name:InvitationCode.name, schema: InvitationCodeSchema},
      {name:Team.name, schema:TeamSchema},
      {name:TeamMember.name, schema:TeamMemberSchema},
      {name:Friend.name, schema:FriendSchema},
      {name:PushToken.name, schema:PushTokenSchema},
    ])
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
