import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from '../dto/schemas/team.schema';
import { Connection, FilterQuery, Model } from 'mongoose';
import { TeamMemberDocument, TeamMember } from '../dto/schemas/team-member.schema';
import { v1 as uuidv1 } from 'uuid';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { ErrCode } from '../utils/enumError';
import { IActivityParticipants, IActMemberInfo, ICreditRecord, ITeam, ITeamActivity, ITeamMember, ITeamPositionInfo } from '../dto/interface/team-group.if';
import { DateWithLeadingZeros } from '../utils/common';
import { GetTeamsResponse } from '../dto/teams/get-teams-response';
import { TeamDetailResponse } from '../dto/teams/team-detail-response';
import { Upload2S3 } from '../utils/upload-2-s3';
import { MEMBER_FROM, MEMBER_LEVEL, TeamMemberPosition } from '../utils/enum';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { IUser } from '../dto/interface/user.if';
import { CreditRecord, CreditRecordDocument } from '../dto/schemas/credit-record.schema';
import { TeamActivity, TeamActivityDocument } from '../dto/schemas/team-activity.schema';
import { ActivityParticipantsResponse } from '../dto/teams/activity-participants-response';
import { TeamMemberAddRequestDto } from '../dto/teams/team-member-add-request.dto';
import { IMember } from '../dto/interface/member.if';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { KS_MEMBER_STYLE_FOR_SEARCH, KS_SHAREHOLDER_STYLE_FOR_SEARCH } from '../utils/constant';
import { refs } from '@nestjs/swagger';

@Injectable()
export class TeamsService {
    constructor(
        @InjectModel(Team.name) private readonly modelTeam:Model<TeamDocument>,
        @InjectModel(TeamMember.name) private readonly modelTeamMember:Model<TeamMemberDocument>,
        @InjectModel(Member.name) private readonly modelMember:Model<MemberDcoument>,
        @InjectModel(KsMember.name) private readonly modelKs:Model<KsMemberDocument>,
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
            teamRes.data = await this.modelTeam
                .find(filter)
                // .populate({
                //     path: 'members',
                //     select: 'name role joinDate',
                //     populate: {
                //         path: 'member',
                //         select: 'id name phone membershipType systemId',
                //     },
                // })
                // .populate({
                //     path: 'creditHistory',
                //     select: 'date score reason',
                // })
                // .populate({
                //     path: 'activities',
                //     // match: { date: { $gte: '2025/07/16'} },
                //     select: 'id title date',
                // })
                .exec();
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
            const team = await this.modelTeam
                .findOne({ id: teamId })
                .populate({
                    path:'members', 
                    // select: 'name joinDate role memberFrom',
                    // populate: {
                    //     path: 'member',
                    //     select: 'id no name phone membershipType systemId',
                    //     localField: 'name',
                    //     foreignField: 'member',
                    // }
                })
                .populate({
                    path: 'creditHistory',
                    select: 'date score reason',
                })
                .populate({
                    path: 'activities',
                    // match: { date: { $gte: '2025/07/16'} },
                    select: 'id title date',
                })
                .exec();
            if (!team) {
                teamDetailRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            } else {
                // const members = team.members.map((mbr) => {
                //     const myM = mbr.member as Partial<IMember>;
                //     mbr._doc = {
                //         ...myM._doc,
                //     }

                    // const newM: ITeamMember = {
                    //     ...(mbr.member as Partial<IMember>),
                    //     // id: myM.id,
                    //     // name: myM.name,
                    //     // phone: myM.phone,
                    //     // membershipType: myM.membershipType,
                    //     // systemId: myM.systemId,
                    //     // joinDate: mbr.joinDate,
                    //     // role: mbr.role,
                    // }
                      
                    // console.log('newM:', newM);
                    //return newM;

                    // return mbr;
                //});
                // console.log('team.members:', team.members);
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

    
    async addTeamMember(teamId: string, memberInfo: TeamMemberAddRequestDto): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        const session = await this.connection.startSession();
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId },'members');
            if (!team) {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                return comRes;
            }
            console.log('team:', team);
            let mbr:any;
            let data:Partial<ITeamMember> = {};
            if (KS_MEMBER_STYLE_FOR_SEARCH.test(memberInfo.memberId)){
                mbr = await this.modelKs.findOne({no: memberInfo.memberId}, 'no name');
                // memberFrom = MEMBER_FROM.KS;
                data.id = mbr.no;
                data.name = mbr.name;
                data.phone = memberInfo.phone;
                // if (KS_SHAREHOLDER_STYLE_FOR_SEARCH.test(mbr.no)) {
                //     data.membershipType = MEMBER_LEVEL.SHARE_HOLDER;
                // } else {
                //     data.membershipType = MEMBER_LEVEL.DEPENDENTS;
                // }
                data.systemId = mbr.no;
            } else {
                mbr = await this.modelMember.findOne({id: memberInfo.memberId}, 'id name phone membershipType systemId');
                data.id = mbr.id;
                data.name = mbr.name;
                data.phone = mbr.phone;
                data.membershipType = mbr.membershipType;
                data.systemId = mbr.systemId;
                // memberFrom = MEMBER_FROM.APP;
            }
            if (!mbr) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            console.log('mbr:', mbr);
            // Check if the member already exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, id: memberInfo.memberId });
            if (existingMember) {
                comRes.ErrorCode = ErrCode.TEAM_MEMBER_ALREADY_EXISTS;
                return comRes;
            }
            session.startTransaction();
            // Create a new team member
            data.teamId = teamId;
            data.role = memberInfo.role;
            data.joinDate = DateWithLeadingZeros();
            const newMember = new this.modelTeamMember(data);
            const ans = await newMember.save({ session });
            if (ans) {
                //team.members.push(ans._id); // Add the new member's ID to the team's members array
                // await team.save({session}); // Save the updated team
                const updData:FilterQuery<TeamDocument> = {
                    $push: { members: ans._id }
                };
                const pos:ITeamPositionInfo = {
                    id: data.id,
                    name: data.name,
                    phone: data.phone,
                }
                let isRoleChange = false;
                if (memberInfo.role === TeamMemberPosition.MANAGER) {
                    updData.manager = pos;
                    isRoleChange = true;
                } else if (memberInfo.role === TeamMemberPosition.LEADER) {
                    updData.leader = pos;
                    isRoleChange = true;
                }
                if (isRoleChange) {
                    isRoleChange = false;
                    await team.populate('members');
                    console.log('' ,team.members);
                    let needChange_id = '';
                    team.members.forEach((mb) => {
                        if (mb.role === memberInfo.role && mb.id !== memberInfo.memberId) {
                            // mb.role = TeamMemberPosition.MEMBER;
                            needChange_id = mb._id;                           
                        }
                    })
                    if (needChange_id) {
                        const updT = await this.modelTeamMember
                        .updateOne({_id: needChange_id}, {role: TeamMemberPosition.MEMBER}, {session});
                        console.log('updT:', updT);
                        if (!updT.acknowledged) {
                            comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
                            comRes.error.extra = `Update TeamMember (ObjectId:${needChange_id}) role error`;
                            session.abortTransaction();
                            session.endSession();
                            return comRes;
                        }
                    }
                }
                await this.modelTeam.updateOne({ id: teamId }, updData, { session });
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
            // const team = await this.modelTeam.findOne({ id: teamId}, 'members');
            // if (!team) {
            //     comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
            //     return comRes;
            // }
            // Check if the member
            // let mbr:any;
            // if (KS_MEMBER_STYLE_FOR_SEARCH.test(memberId)){
            //     mbr = await this.modelKs.findOne({no: memberId}, 'no name');
            // } else {
            //     mbr = await this.modelMember.findOne({id: memberId}, 'id name phone');
            // }
            // if (!mbr) {
            //     comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
            //     return comRes;
            // }
            // Check if the member exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, id: memberId });
            if (!existingMember) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Update the member information
            const session = await this.connection.startSession();
            session.startTransaction();
            let upd = await this.modelTeamMember.updateOne(
                { teamId, role: memberInfo.role },
                { role: TeamMemberPosition.MEMBER },
                { session }
            );
            console.log('upd1:', upd);
            upd = await this.modelTeamMember.updateOne(
                {teamId, id: memberId},
                memberInfo,
                {session},
            )
            console.log('upd2:', upd, memberInfo)
            if (!upd.acknowledged) {
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
            // const team = await this.modelTeam.findOne({ id: teamId });
            // if (!team) {
            //     comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            //     return comRes;
            // }
            // Check if the member exists
            let mbr:any;
            if (KS_MEMBER_STYLE_FOR_SEARCH.test(memberId)) {
                mbr = await this.modelKs.findOne({no: memberId}, 'no');
                console.log('ks:', mbr);
            } else {
                mbr = await this.modelMember.findOne({id: memberId}, 'id');
            }
            if (!mbr) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Check if the member exists in the team
            const existingMember = await this.modelTeamMember.findOne({ teamId, id: memberId });
            if (!existingMember) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Delete the member from the team
            const session = await this.connection.startSession();
            session.startTransaction();
            const deleteResult = await this.modelTeamMember.deleteOne({ teamId, id: memberId }, { session });
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
                const creditScore = team.creditScore ? team.creditScore + creditInfo.score : creditInfo.score;
                const upd = await this.modelTeam.updateOne(
                    { id: teamId },
                    { creditScore  ,$push: { creditHistory: ans._id } },
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
                taCreate.id = uuidv1();
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
                    const t = await this.modelTeamActivity.updateOne(
                        { teamId, id: actId}, 
                        { $set: modifyAct}
                    )
                    console.log('modifyTeamActivity:', t);
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
            const act = await this.modelTeamActivity
                .findOne({id: activityId}, 'participants')
                .populate({ 
                    path:'participants',
                    populate: {
                        path: 'member',
                    }
                }).exec();
            if (act) {
                const mbrs = act.participants.map((p:IActivityParticipants) => {
                    const nMbr:Partial<IActMemberInfo> = {
                        ...(p.member as Partial<IMember>),
                        registrationDate: p.registrationDate,
                        status: p.status,
                        // id: p.member.id,
                        // name: p.name,
                        // phone: p.phone,
                        // membershipType: p.membershipType,
                        // registrationDate: f.registrationDate,
                        // status: f.status,
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