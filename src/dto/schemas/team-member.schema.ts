import { Prop, Schema } from '@nestjs/mongoose';
import { ITeamMember } from '../interface/team-group.if';
import { TeamMemberPosition } from '../../utils/enum';
import mongoose from 'mongoose';

@Schema()
export class TeamMemember implements ITeamMember {
    @Prop({
        index: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'Team'
    })
    teamObjId?: string;    //球隊ID

    @Prop({index: true})
    id:	string; // 會員 ID

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
}