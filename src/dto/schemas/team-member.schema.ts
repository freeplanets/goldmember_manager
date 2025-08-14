import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITeamMember } from '../interface/team-group.if';
import { COLLECTION_REF, MEMBER_LEVEL, TeamMemberPosition, TeamMemberStatus } from '../../utils/enum';
import mongoose, { Document } from 'mongoose';

export type TeamMemberDocument =  Document & TeamMember;

@Schema()
export class TeamMember implements Partial<ITeamMember> {
    @Prop({index: true})
    teamId: string; // 球隊 ID

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'memberFrom',
        //ref: 'Member',
    })
    //member: string;  //Partial<IMember>
    memberInfo?: string;

    @Prop({
        type: String,
        required: true,
        enum: ['Member', 'KsMember'],
    })
    memberFrom?: COLLECTION_REF;

    @Prop()
    id?: string;

    // @Prop()
    // name?: string;

    // @Prop()
    // phone?: string;

    // @Prop()
    // membershipType?: MEMBER_LEVEL;

    // @Prop()
    // systemId?: string;

    @Prop()
    handicap?: number;

    @Prop({
        enum: TeamMemberPosition,
    })
    role: TeamMemberPosition; // 角色

    @Prop()
    joinDate: string; //加入日期

    @Prop()
    isActive: boolean; //是否活躍

    @Prop()
    status?: TeamMemberStatus;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

TeamMemberSchema.index(
    { teamId: 1, id: 1 },
    { unique: true },
);