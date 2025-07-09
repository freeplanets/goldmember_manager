import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from '../dto/schemas/team.schema';
import { Connection, FilterQuery, Model } from 'mongoose';
import { TeamMemberDocument, TeamMember } from '../dto/schemas/team-member.schema';
import { v1 as uuidv1 } from 'uuid';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { ErrCode } from '../utils/enumError';
import { IActMemberInfo, ICreditRecord, ITeam, ITeamActivity, ITeamMember } from '../dto/interface/team-group.if';
import { DateWithLeadingZeros } from '../utils/common';
import { GetTeamsResponse } from '../dto/teams/get-teams-response';
import { TeamDetailResponse } from '../dto/teams/team-detail-response';
import { Upload2S3 } from '../utils/upload-2-s3';
import { TeamMemberPosition } from '../utils/enum';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { IUser } from '../dto/interface/user.if';
import { CreditRecord, CreditRecordDocument } from '../dto/schemas/credit-record.schema';
import { TeamActivity, TeamActivityDocument } from '../dto/schemas/team-activity.schema';
import { ActivityParticipantsResponse } from '../dto/teams/activity-participants-response';

@Injectable()
export class TeamsService {
    constructor(
        @InjectModel(Team.name) private readonly modelTeam:Model<TeamDocument>,
        @InjectModel(TeamMember.name) private readonly modelTeamMember:Model<TeamMemberDocument>,
        @InjectModel(Member.name) private readonly modelMember:Model<MemberDcoument>,
        @InjectModel(CreditRecord.name) private readonly modelCreditRecord:Model<CreditRecordDocument>,
        @InjectModel(TeamActivity.name) private readonly modelTeamActivity:Model<TeamActivityDocument>,
        @InjectConnection() private readonly connection: Connection, // 
    ) {}
    async getTeams(search:string=''){
        const teamRes = new GetTeamsResponse();
        const filter:FilterQuery<TeamDocument> = {};
        if (search !== '') {
            filter.name = { $regex: `${search}.*`}
        }
        try {
            teamRes.data = await this.modelTeam.find(filter).populate('members','name joinDate').exec();
        } catch (error) {
            console.error('Error fetching teams:', error);
            teamRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            teamRes.error.extra = error.message;
        }
        return teamRes;
    }
    async getTeamDetail(teamId: string): Promise<TeamDetailResponse> {
        const teamDetailRes = new TeamDetailResponse();
        try {
            const team = await this.modelTeam.findOne({ id: teamId }).populate('members', 'name joinDate').exec();
            if (!team) {
                teamDetailRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            } else {
                teamDetailRes.data = team;
            }
        } catch (error) { 
            console.error('Error fetching team details:', error);
            teamDetailRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            teamDetailRes.error.extra = error.message;
        }
        return teamDetailRes;
    }

    async createTeam(teamInfo: Partial<Team>): Promise<CommonResponseDto> {
        const comRes= new CommonResponseDto();
        try {
            if (!teamInfo.leader && !teamInfo.manager) {
                comRes.ErrorCode = ErrCode.TEAM_ERROR_CONTACT_PERSON
            } else {
                teamInfo.id = uuidv1(); // Generate a unique ID for the team
                const newTeam = new this.modelTeam(teamInfo);
                await newTeam.save();
            }
        } catch (error) {
            console.error('Error creating team:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async updateTeam(teamId: string, teamInfo: Partial<Team>): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            const updateResult = await this.modelTeam.updateOne({ id: teamId }, { $set: teamInfo });
            if (updateResult.modifiedCount === 0) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            }
        } catch (error) {
            console.error('Error updating team:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }

    async uploadTeamLogo(teamId: string, logo: Express.Multer.File): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            if (logo) {
                // Assuming upload2S3 is a service that handles S3 uploads
                const upload2S3 = new Upload2S3();
                const ans = await upload2S3.uploadFile(logo);
                if (ans) {
                    const res = upload2S3.Response;
                    console.log('Logo uploaded successfully:', res);
                    const updateResult = await this.modelTeam.updateOne({ id:teamId }, { $set: { logoUrl: res.fileUrl } });
                    if (updateResult.modifiedCount === 0) {
                        comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                    }
                } 
            }
        } catch (error) {
            console.error('Error uploading team logo:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }

    
    async addTeamMember(teamId: string, memberInfo: Partial<ITeamMember>): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        const session = await this.connection.startSession();
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId });
            if (!team) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                return comRes;
            }
            console.log('team:', team);
            // Check if the member already exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, memberId: memberInfo.memberId });
            if (existingMember) {
                comRes.ErrorCode = ErrCode.TEAM_MEMBER_ALREADY_EXISTS;
                return comRes;
            }
            session.startTransaction();
            // Create a new team member
            if (!memberInfo.phone) {
                const member = await this.modelMember.findOne({ id: memberInfo.memberId }, 'phone');
                if (member) {
                    memberInfo.phone = member.phone;
                } 
            }
            const newMember = new this.modelTeamMember({
                teamId,
                memberId: memberInfo.memberId,
                name: memberInfo.name,
                phone: memberInfo.phone,
                joinDate: DateWithLeadingZeros(),
            });
            const ans = await newMember.save({ session });
            if (ans) {
                //team.members.push(ans._id); // Add the new member's ID to the team's members array
                // await team.save({session}); // Save the updated team
                await this.modelTeam.updateOne({ id: teamId }, { $push: { members: ans._id } }, { session });
                await session.commitTransaction();
                console.log('New team member added successfully:', team, ans);
            } else {
                console.log('Failed to save new team member:', ans);
                comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
                await session.abortTransaction();
            }
        } catch (error) {
            console.error('Error adding team member:', error);
            await session.abortTransaction();
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }

    async updateTeamMember(
        teamId: string,
        memberId: string,
        memberInfo: Partial<ITeamMember>
    ): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId });
            if (!team) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                return comRes;
            }
            // Check if the member exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, memberId });
            if (!existingMember) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Update the member information
            const session = await this.connection.startSession();
            session.startTransaction();
            const updateResult = await this.modelTeamMember.updateOne(
                { teamId, memberId },
                { $set: memberInfo },
                { session }
            );
            if (updateResult.modifiedCount === 0) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            }            
            const updateTeam:Partial<ITeam> = {}
            if (memberInfo.role === TeamMemberPosition.LEADER) {
                updateTeam.leader = {
                    id: memberId,
                    name: existingMember.name,
                    phone: existingMember.phone,
                }
            } else if (memberInfo.role === TeamMemberPosition.MANAGER) {
                updateTeam.manager = {
                    id: memberId,
                    name: existingMember.name,
                    phone: existingMember.phone,
                }
            }
            if (Object.keys(updateTeam).length > 0) {
                const ans = await this.modelTeam.updateOne({ id: teamId }, { $set: updateTeam }, {session });
                if (ans.modifiedCount === 0) {
                    comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                }
            }
            if (comRes.ErrorCode) {
                await session.abortTransaction();
            } else {
                await session.commitTransaction();
            }
            await session.endSession();
        } catch (error) {
            console.error('Error updating team member:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }

    async deleteTeamMember(
        teamId: string,
        memberId: string
    ): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId });
            if (!team) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                return comRes;
            }
            // Check if the member exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, memberId });
            if (!existingMember) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Delete the member from the team
            const session = await this.connection.startSession();
            session.startTransaction();
            const deleteResult = await this.modelTeamMember.deleteOne({ teamId, memberId }, { session });
            if (deleteResult.deletedCount === 0) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            } else {
                // Remove the member's ID from the team's members array
                await this.modelTeam.updateOne({ id: teamId }, { $pull: { members: existingMember._id } }, { session });
                await session.commitTransaction();
                console.log('Team member deleted successfully:', existingMember);
            }
            await session.endSession();
        } catch (error) {
            console.error('Error deleting team member:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }

    async updateTeamCredit(teamId: string, creditInfo: Partial<ICreditRecord>, user:Partial<IUser>): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId }, 'creditScore');
            if (!team) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                return comRes;
            }
            // Create a new credit record
            const newCreditRecord: ICreditRecord = {
                id: uuidv1(), // Generate a unique ID for the credit record
                refId: teamId,
                score: creditInfo.score,
                reason: creditInfo.reason,
                date: DateWithLeadingZeros(),
                recordedBy: {
                    modifiedBy: user.id,
                    modifiedByWho: user.displayName || user.username,
                    modifiedAt: Date.now(),
                },
            };
            const session = await this.connection.startSession();
            session.startTransaction();

            const newCredit = new this.modelCreditRecord(newCreditRecord);
            const ans = await newCredit.save({ session });
            if (ans) {
                const upd = await this.modelTeam.updateOne(
                    { id: teamId },
                    { $push: { creditHistory: ans._id } },
                    { session }
                );
                if (upd.modifiedCount === 0) {
                    comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                } else {
                    await session.commitTransaction();
                    console.log('Team credit updated successfully:', upd);
                }
            }
            await session.endSession();
        } catch (error) {
            console.error('Error updating team credit:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async createTeamActivity(teamId:string, taCreate:Partial<ITeamActivity>):Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const team = await this.modelTeam.findOne({id: teamId});
            if (team) {
                taCreate.teamId = teamId;
                const act = new this.modelTeamActivity(taCreate);
                const ans = await act.save({session});
                if (ans) {
                    const t = await this.modelTeam.updateOne(
                        {id: teamId}, 
                        {$push: { activities: ans._id }},
                        { session}
                    )
                    if (t) {
                        await session.commitTransaction();
                    } else {
                        await session.abortTransaction();
                        comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
                    }
                } else {
                    comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
                }
                
            }  else {
                comRes.ErrorCode = ErrCode.TEAM_NOT_FOUND;
            }
        } catch(error) {
            console.log('create TeamActivity error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        await session.endSession();
        return comRes;
    }

    async modifyTeamActivity(teamId:string, actId:string, modifyAct:Partial<ITeamActivity>){
        const comRes = new CommonResponseDto();
        try {
            if (Object.keys(modifyAct).length > 0) {
                const act = await this.modelTeamActivity.findOne({teamId, id: actId});
                if (act) {
                    const t = await this.modelTeam.updateOne(
                        { teamId, id: actId}, 
                        {$set: modifyAct}
                    )
                    if (!t) { 
                        comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
                    }                
                }  else {
                    comRes.ErrorCode = ErrCode.TEAM_NOT_FOUND;
                }
            } else {
                comRes.ErrorCode = ErrCode.MISS_PARAMETER;
            }
        } catch(error) {
            console.log('modify TeamActivity error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;        
    }
    async getActivityParticipants(activityId:string):Promise<ActivityParticipantsResponse> {
        const comRes = new ActivityParticipantsResponse();
        try {
            const act = await this.modelTeamActivity.findOne({id: activityId}, 'participants').populate('participants').exec();
            if (act) {
                const mbrs = act.participants.map((p) => {
                    const f = p.activities.find((act) => act.activityId === activityId);
                    const nMbr:Partial<IActMemberInfo> = {
                        id: p.memberId,
                        name: p.name,
                        phone: p.phone,
                        membershipType: p.membershipType,
                        registrationDate: f.registrationDate,
                        status: f.status,
                    };
                    return nMbr;
                });
                comRes.data = mbrs;
            } else {
                comRes.ErrorCode = ErrCode.TEAM_ACTIVITY_NOT_FOUND;
            }
        } catch(error) {
            console.log('getActivityParticipants error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
}