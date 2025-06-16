import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITeam, ITeamPositionInfo } from '../interface/team-group.if';
import { TeamStatus } from 'src/utils/enum';
import { TeamPositonInfo } from '../team/team-position-info';
import { Document } from 'mongoose';

export type TeamDocument = Document & Team;

@Schema()
export class Team implements ITeam {
    @Prop({index: true, unique: true})
    id: string;

    @Prop({unique: true})
    name: string;   //球隊名稱

    @Prop({enum: TeamStatus})
    status:	TeamStatus; //球隊狀態

    @Prop()
    creditScore: number;    //信用評分

    @Prop()
    logoUrl: string;    //球隊 Logo URL

    @Prop()
    description: string;    //球隊描述

    @Prop({
        type: TeamPositonInfo,
    })
    leader:	ITeamPositionInfo;  // 隊長

    @Prop({
        type: TeamPositonInfo,
    })
    manager: ITeamPositionInfo; // 經理

    @Prop()
    lastActivity: string; //最近活動日期
}

export const TeamSchema = SchemaFactory.createForClass(Team);