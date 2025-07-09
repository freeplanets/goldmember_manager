import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IMemberActivityInfo, ITeamMember } from '../interface/team-group.if';
import { TeamMemberPosition } from '../../utils/enum';
import { Document } from 'mongoose';
import { MemberActivityInfo } from '../teams/member-activity-info';

export type TeamMemberDocument =  Document & TeamMember;

@Schema()
export class TeamMember implements ITeamMember {
    @Prop({index: true})
    teamId: string; // 球隊 ID

    @Prop({index: true})
    memberId:	string; // 會員 ID

    @Prop()
    name: string; // 會員姓名

    @Prop({
        enum: TeamMemberPosition,
    })
    role: TeamMemberPosition; // 角色

    @Prop()
    joinDate: string; //加入日期

    @Prop()
    isActive: boolean; //是否活躍

    @Prop()
    phone?: string;

    @Prop({
        type: Array<MemberActivityInfo>,
    })
    activities?: IMemberActivityInfo[];
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

TeamMemberSchema.index(
    { teamId: 1, memberId: 1 },
    { unique: true },
);