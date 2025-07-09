import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITeamActivity, ITeamMember } from '../interface/team-group.if';
import { TeamActivityStatus } from '../../utils/enum';
import { IModifiedBy } from '../interface/modifyed-by.if';
import { ModifiedByData } from '../data/modified-by.data';
import mongoose from 'mongoose';

export type TeamActivityDocument = Document & ITeamActivity;

@Schema()
export class TeamActivity implements ITeamActivity {
    @Prop({ unique: true, required: true })
    id: string; //活動 ID

    @Prop({ index: true, required: true })
    teamId?: string; //球隊ID

    @Prop({ required: true })
    title: string; //標題

    @Prop()
    description: string; //描述

    @Prop() 
    date:string;    //日期

    @Prop()
    location: string;   //地點

    @Prop()
    registrationStart: string;  // 報名開始日期

    @Prop()
    registrationEnd: string;    //報名結束日期

    @Prop({
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember'}],
        default: [],
    })
    participants: ITeamMember[];   // 參與人數

    @Prop()
    maxParticipants: number; //最大參與人數

    @Prop({ enum: TeamActivityStatus})
    status:	TeamActivityStatus; //狀態

    @Prop({
        type: ModifiedByData,
    })
    creator: IModifiedBy; //發起人 
}

export const TeamActivitySchema = SchemaFactory.createForClass(TeamActivity);