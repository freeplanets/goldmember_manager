import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICreditRecord, ITeam, ITeamActivity, ITeamMember, ITeamPositionInfo } from '../interface/team-group.if';
import { TeamStatus } from '../../utils/enum';
import mongoose, { Document } from 'mongoose';
import TeamPositonInfo from '../teams/team-position-info';

export type TeamDocument = Document & Team;

@Schema()
export class Team implements ITeam {
    @Prop({index: true, unique: true})
    id: string;

    @Prop({unique: true})
    name: string;   //球隊名稱

    @Prop({enum: TeamStatus})
    status:	TeamStatus; //球隊狀態

    @Prop({
        default: 100,
    })
    creditScore: number;    //信用評分

    @Prop()
    logoUrl: string;    //球隊 Logo URL

    @Prop()
    description: string;    //球隊描述

    // @Prop({
    //     type: TeamPositonInfo,
    // })
    // leader:	ITeamPositionInfo;  // 隊長

    // @Prop({
    //     type: TeamPositonInfo,
    // })
    // manager: ITeamPositionInfo; // 經理

    @Prop({
        type: TeamPositonInfo,
    })    
    contacter: ITeamPositionInfo;   //連絡人

    @Prop()
    lastActivity: string; //最近活動日期

    @Prop({
        //type: Array<mongoose.Schema.Types.ObjectId>, ref: 'TeamMember',
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'TeamMember',
            select: 'id name role joinDate phone membershipType isActive systemId',
        }],
        default: [],
    })
    members: ITeamMember[];

    @Prop({
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'CreditRecord' 
        }],
        default: [],
        select: false,
    })
    creditHistory?: ICreditRecord[];

    @Prop({
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'TeamActivity'}],
        default: [],
    })
    activities?: ITeamActivity[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);