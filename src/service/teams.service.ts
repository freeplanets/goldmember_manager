import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from '../dto/schemas/team.schema';
import mongoose, { Connection, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { TeamMemberDocument, TeamMember } from '../dto/schemas/team-member.schema';
import { v1 as uuidv1 } from 'uuid';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { ErrCode } from '../utils/enumError';
import { IActivityParticipants, IActMemberInfo, ICreditRecord, ITeam, ITeamActivity, ITeamMember, ITeamPositionInfo } from '../dto/interface/team-group.if';
import { GetTeamsResponse } from '../dto/teams/get-teams-response';
import { TeamDetailResponse } from '../dto/teams/team-detail-response';
import { Upload2S3 } from '../utils/upload-2-s3';
import { COLLECTION_REF, TeamMemberPosition, TeamMemberStatus } from '../utils/enum';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import { IUser } from '../dto/interface/user.if';
import { CreditRecord, CreditRecordDocument } from '../dto/schemas/credit-record.schema';
import { TeamActivity, TeamActivityDocument } from '../dto/schemas/team-activity.schema';
import { ActivityParticipantsResponse } from '../dto/teams/activity-participants-response';
import { TeamMemberAddRequestDto } from '../dto/teams/team-member-add-request.dto';
import { IMember } from '../dto/interface/member.if';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';
import { KS_MEMBER_STYLE_FOR_SEARCH } from '../utils/constant';
import { IbulkWriteItem, IHasId, IHasPhone } from '../dto/interface/common.if';
import TeamPositonInfo from '../dto/teams/team-position-info';
import TeamCreateRequestDto from '../dto/teams/team-create-request.dto';
import { TeamUpdateRequestDto } from '../dto/teams/team-update-request.dto';
import { DateRangeQueryReqDto } from '../dto/common/date-range-query-request.dto';
import { CreditRecordRes } from '../dto/teams/credit-record-response';
import { CommonResponseData } from '../dto/common/common-response.data';
import { TeamActivitiesRes } from '../dto/teams/team-activities-response';
import { TEAM_DETAIL_FIELDS } from '../utils/base-fields-for-searh';
import { DateLocale } from '../classes/common/date-locale';

interface I_TMPositon {
    T: TeamPositonInfo;
    Pos: TeamMemberPosition;
}

@Injectable()
export class TeamsService {
    private myDate = new DateLocale();
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
                .find(filter, TEAM_DETAIL_FIELDS)
                .populate({
                    path: 'members',
                    select: 'role joinDate handicap status memberInfo memberFrom',
                    populate: {
                        path: 'memberInfo',
                        select: 'id no name pic handicap phone',
                    },
                })
                // .populate({
                //     path: 'creditHistory',
                //     select: 'date score reason recordedBy',
                // })
                // .populate({
                //     path: 'activities',
                //     // match: { date: { $gte: '2025/07/16'} },
                //     // select: 'id title date',
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
                .findOne({ id: teamId }, TEAM_DETAIL_FIELDS)
                .populate({
                    path:'members', 
                    select: 'role joinDate handicap status memberInfo memberFrom',
                    populate: {
                        path: 'memberInfo',
                        select: 'id no name pic handicap phone',
                        //localField: 'name',
                        //foreignField: 'member',
                    }
                })
                // .populate({
                //     path: 'creditHistory',
                //     select: 'date score reason recordedBy',
                // })
                // .populate({
                //     path: 'activities',
                //     // match: { date: { $gte: '2025/07/16'} },
                //     // select: 'id title date',
                // })
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

    async createTeam(
        teamInfo: TeamCreateRequestDto,
        file: Express.Multer.File | undefined = undefined,
    ): Promise<CommonResponseDto> {
        const comRes= new CommonResponseData();
        try {
            const newTeam:Partial<ITeam> = {
                id: uuidv1(), // Generate a unique ID for the team
                name: teamInfo.name,
                description: teamInfo.description,
            }
            if (teamInfo.contacter) newTeam.contacter = teamInfo.contacter;
            if (file) {
                console.log("check1:", file);
                const rlt = await this.uploadLogo(file);
                if (rlt) {
                    console.log('filename:', rlt);
                    newTeam.logoUrl = rlt.fileUrl;
                    // newTeam.description = rlt.OriginalFilename;
                }
            }
            // if (!teamInfo.leader && !teamInfo.manager && !teamInfo.contacter) {
            //     comRes.ErrorCode = ErrCode.TEAM_ERROR_CONTACT_PERSON
            // } else {
                const tmbrs:Partial<ITeamMember>[] = [];
                const tmPoss = this.teamPosCheck(teamInfo);
                for (let i=0,n=tmPoss.length; i < n; i++) {
                    const mbr = tmPoss[i];
                    const tmp = await this.getMember(mbr.T);
                    if (tmp) {
                        //teamInfo.manager.id = tmp.id;
                        tmp.teamId = newTeam.id;
                        tmp.role = mbr.Pos;
                        console.log('tmp:', tmp);
                        tmbrs.push(tmp);
                    }
                }
                const session = await this.connection.startSession();
                session.startTransaction()
                if (tmbrs.length > 0) {
                    const ins = await this.modelTeamMember.insertMany(tmbrs, {session});
                    console.log('insert teammembers:', ins);
                    newTeam.members = ins.map((m) => m._id);
                }
                const Team = new this.modelTeam(newTeam);
                const rlt = await Team.save({session});
                console.log('createTeam rlt:', rlt);
                if (rlt) {
                    await session.commitTransaction();
                    comRes.data = rlt.id;
                } else {
                    await session.abortTransaction();
                }
                await session.endSession();
            //}
        } catch (error) {
            console.error('Error creating team:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async updateTeam(teamId: string, teamInfo: TeamUpdateRequestDto, file:Express.Multer.File): Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            const updTeam:UpdateQuery<TeamDocument> = {};
            const updTMData:IbulkWriteItem<TeamMemberDocument>[] = [];
            if (teamInfo.name) updTeam.name = teamInfo.name;
            if (teamInfo.description) updTeam.description = teamInfo.description;
            if (teamInfo.status) updTeam.status = teamInfo.status;
            if (teamInfo.contacter) updTeam.contacter = teamInfo.contacter;
            const team = await this.modelTeam.findOne({id: teamId}).populate({
                    path: 'members',
                    select: 'role joinDate handicap status memberInfo memberFrom',
                    populate: {
                        path: 'memberInfo',
                        select: 'id no name pic handicap',
                    },
                });
            if (team) {
                const tmPoss = this.teamPosCheck(teamInfo);
                for(let i=0, n=tmPoss.length;i<n;i++) {
                    const pmbr = tmPoss[i].T;
                    const pos = tmPoss[i].Pos;
                    // 修改成員是否已在會員表列中
                    const f = team.members.find((mbr) => (mbr.memberInfo as any).id === pmbr.id);
                    if (f) {
                        // 如果職務不同，則修改職務
                        if (f.role !== pos) {
                            updTMData.push({
                                updateOne: {
                                    filter: {
                                        _id: f._id,
                                    },
                                    update: {
                                        role: pos,
                                    }
                                }
                            })
                        }
                    } else { 
                        //不在會員列表中則新增
                        const tmp = await this.getMember(pmbr);
                        tmp.teamId = team.id;
                        tmp.role = pos,
                        tmp.joinDate = this.myDate.toDateString();
                        tmp.isActive = true;
                        updTMData.push({
                            insertOne: { document: tmp as any },
                        })
                    }
                    // 如果有相同職務的其他會員則改為一般會員
                    const fPos = team.members.find((mbr) => mbr.role === pos);
                    if (fPos) {
                        if ((fPos.memberInfo as any).id !== pmbr.id) {
                            updTMData.push({
                                updateOne: {
                                    filter: { _id: fPos._id, role: pos },
                                    update: { role : TeamMemberPosition.MEMBER },
                                }
                            })
                        }
                    }
                }
                if (updTMData.length > 0) {
                    const upd = await this.modelTeamMember.bulkWrite(updTMData as any);
                    console.log("add new TeamMember:", upd)
                    const updItems = Object.keys(upd.insertedIds).map((key) => upd.insertedIds[key]);
                    console.log("updItems:", updItems);
                    if (updItems.length > 0) {
                        updTeam.$push = {
                            members: { $each: updItems }
                        }
                    }
                }
                if (file) {
                    console.log("check1:", file);
                    const rlt = await this.uploadLogo(file);
                    if (rlt) {
                        console.log('filename:', rlt);
                        updTeam.logoUrl = rlt.fileUrl;
                        // newTeam.description = rlt.OriginalFilename;
                    }
                }
                console.log("updTeam:", updTeam);
                const updateResult = await this.modelTeam.updateOne({ id: teamId }, updTeam);
                if (updateResult.modifiedCount === 0) {
                    comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
                }
            } else {
                comRes.ErrorCode = ErrCode.TEAM_NOT_FOUND;
            }
        } catch (error) {
            console.error('Error updating team:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async uploadLogo(logo: Express.Multer.File) {
        const upload2S3 = new Upload2S3();
        const ans = await upload2S3.uploadFile(logo);
        if (ans) {
            return upload2S3.Response;
        }
        return false;
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
        const bulkW:IbulkWriteItem<TeamMemberDocument>[]=[];
        try {
            // Check if the team exists
            const team = await this.modelTeam.findOne({ id: teamId },'id');
            if (!team) {
                comRes.ErrorCode = ErrCode.TEAM_NOT_FOUND;
                return comRes;
            }
            console.log('team:', team);
            const obj:IHasId = {
                id: memberInfo.memberId,
                phone: memberInfo.phone,
                role: memberInfo.role,
            }
            const mbr = await this.getMember(obj);
            const teamMbr = await this.modelTeamMember.findOne({teamId, memberInfo: mbr.memberInfo});
            if (teamMbr) {
                if (teamMbr.role === memberInfo.role) {
                    comRes.ErrorCode = ErrCode.TEAM_MEMBER_ALREADY_EXISTS;
                    return comRes;
                }
                bulkW.push({
                    updateOne: {
                        filter: { teamId, memberInfo: mbr.memberInfo},
                        update: { role: memberInfo.role },
                    }
                });
            } else {
                mbr.teamId = teamId;
                console.log("mbr:", mbr);
                bulkW.push({
                    insertOne: {
                        document: mbr as any,
                    }
                });
            }
            if (memberInfo.role !== TeamMemberPosition.MEMBER) {
                const oldRole = await this.modelTeamMember.findOne({
                    teamId,
                    role: memberInfo.role,
                })
                console.log("oldRole:", oldRole);
                if (oldRole) {
                    bulkW.push({
                        updateOne: {
                            filter: {
                                _id: oldRole._id,
                            },
                            update: {
                                role: TeamMemberPosition.MEMBER
                            },
                        }
                    });
                }
            }
            session.startTransaction();
            // update TeamMember
            let newMbrObjId = '';
            bulkW.forEach((b) => {
                // console.log(b.insertOne, b.updateOne);
                if (b.insertOne) {
                    console.log("insertOne:", b.insertOne.document);
                }
                if (b.updateOne) {
                    console.log("updateOne");
                    console.log("filter:", b.updateOne.filter);
                    console.log("update:", b.updateOne.update);
                }
            })
            if (bulkW.length > 0) {
                const updTM = await this.modelTeamMember.bulkWrite(bulkW as any, {session});
                console.log("bulKW result:", updTM);
                if (updTM.insertedIds) {
                    newMbrObjId = updTM.insertedIds['0'];
                }
            }
            // Create a new team member
            if (newMbrObjId) {
                const ans = await this.modelTeam.updateOne(
                    { id: teamId }, 
                    { $push: { members: newMbrObjId }}, 
                    { session }
                );
                console.log('New team member added successfully:', ans);
            }
            await session.commitTransaction();
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
            const obj:IHasId = {
                id: memberId,
            };
            const mbr = await this.getMember(obj);
            const filter:FilterQuery<TeamMemberDocument> = {
                teamId,
                //id: memberId,
                memberInfo: mbr.memberInfo,
            }
            const existingMember = await this.modelTeamMember.findOne(filter);
            console.log("existingMember:", filter, existingMember);
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
                {teamId, memberInfo: mbr.memberInfo},
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
            const existingMember = await this.modelTeamMember.findOne({ teamId, memberInfo: mbr._id });
            if (!existingMember) {
                comRes.ErrorCode = ErrCode.MEMBER_NOT_FOUND;
                return comRes;
            }
            // Delete the member from the team
            const session = await this.connection.startSession();
            session.startTransaction();
            const deleteResult = await this.modelTeamMember.deleteOne({ teamId, memberInfo: mbr._id }, { session });
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
                date: this.myDate.toDateString(),
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
    async getMember<T extends IHasId>(obj:T){
        let tmbr:Partial<ITeamMember>={};
        if (KS_MEMBER_STYLE_FOR_SEARCH.test(obj.id)) {
            tmbr = await this.getKsMember(obj.id);
        } else {
            tmbr = await this.getAppMember(obj);
        }
        tmbr.joinDate = this.myDate.toDateString();
        tmbr.isActive = true;
        tmbr.status = TeamMemberStatus.CONFIRMED;
        if (obj.phone) {
            tmbr.phone = obj.phone;
        }
        if (obj.role) {
            tmbr.role = obj.role;
        }
        if (!tmbr.handicap) tmbr.handicap = 0;
        return tmbr;        
    }
    async getKsMember(no:string) {
        let tmbr:Partial<ITeamMember>={};
        try {
            const obj = await this.modelKs.findOne({no});
            //tmbr.id = obj.no;
            //tmbr.name = obj.name;
            tmbr.memberInfo = obj._id;
            tmbr.memberFrom = COLLECTION_REF.KsMember;
            // tmbr.phone = obj.phone;
            tmbr.handicap = 0;
            
        } catch (error) {
            console.log('getKsMember error:', error);
        }
        return tmbr;
    }
    async getAppMember<T extends IHasId>(obj:T){
        let tmbr:Partial<ITeamMember>={};
        try {
            const mbr = await this.modelMember.findOne(
                {id: obj.id}, 
                'id'
            );
            console.log('getAppMember:', obj, mbr);
            if (mbr) {
                 tmbr = {
                    //id:	mbr.id,
                    memberInfo: mbr._id,
                    memberFrom: COLLECTION_REF.Member,
                    // name: mbr.name,
                    // phone: mbr.phone,
                    // membershipType: mbr.membershipType,
                    // systemId: mbr.systemId,
                    handicap: mbr.handicap,
                    //status: TeamMemberStatus.CONFIRMED,
                }
            } else {
                tmbr = {}
            }
            return tmbr;
        } catch (err) {
            console.log('getMember error:', err);
        }
        return tmbr;
    }
    teamPosCheck(info:TeamCreateRequestDto) {
        const tmPoss:I_TMPositon[] = [];
        // if (info.leader) {
        //     tmPoss.push({
        //         T: info.leader,
        //         Pos: TeamMemberPosition.LEADER,
        //     })
        // }
        // if(info.manager) {
        //     tmPoss.push({
        //         T: info.manager,
        //         Pos: TeamMemberPosition.MANAGER,
        //     })            
        // }
        if (info.contacter) {
            tmPoss.push({
                T: info.contacter,
                Pos: TeamMemberPosition.CONTACT,
            })
        }
        return tmPoss;
    }
    async getCreditRecords(teamId:string, dates:DateRangeQueryReqDto) {
        const comRes = new CreditRecordRes();
        try {
            const filter:FilterQuery<CreditRecordDocument> = {
                refId: teamId,
            }
            if (dates.endDate && dates.startDate ) {
                filter.$and =  [
                    { date: { $gte: dates.startDate }},
                    { date: { $lte: dates.endDate}},
                ];
            } else if ( dates.startDate) {
                filter.date = { $gte: dates.startDate };
            } else if (dates.endDate) {
                filter.date = { $lte: dates.endDate };
            }
            console.log('filter:', filter, filter.$and);
            comRes.data = await this.modelCreditRecord.find(filter);
        } catch(error) {
            console.log('getCreditRecords error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async getActivities(teamId:string, dates:DateRangeQueryReqDto){
        const comRes = new TeamActivitiesRes();
        try {
            const filter:FilterQuery<CreditRecordDocument> = {
                teamId,
            }
            if (dates.endDate && dates.startDate ) {
                filter.$and =  [
                    { date: { $gte: dates.startDate }},
                    { date: { $lte: dates.endDate}},
                ];
            } else if ( dates.startDate) {
                filter.date = { $gte: dates.startDate };
            } else if (dates.endDate) {
                filter.date = { $lte: dates.endDate };
            }
            comRes.data = await this.modelTeamActivity.find(filter);
        } catch(error) {
            console.log('getCreditRecords error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;        
    }
    async reformTM() {
        const tmrs = await this.modelTeamMember.find({}, 'id');
        const bulks:IbulkWriteItem<TeamMemberDocument>[] = [];
        for(let i=0,n=tmrs.length;i < n;i+=1) {
            const tmr = tmrs[i];
            let ans:any;
            let refPath='';
            if (KS_MEMBER_STYLE_FOR_SEARCH.test(tmr.id)) {
                ans = await this.modelKs.findOne({no: tmr.id}, 'no');
                refPath = COLLECTION_REF.KsMember;
            } else {
                ans = await this.modelMember.findOne({id: tmr.id}, 'id');
                refPath = COLLECTION_REF.Member;
            }
            console.log('reformTM', tmr.id, ans);
            if (!ans) continue;
            bulks.push({
                updateMany: {
                    filter: { id: tmr.id },
                    update: { memberInfo: ans._id, memberFrom: refPath },
                }
            });
        }
        if (bulks.length > 0) {
            const upd = await this.modelTeamMember.bulkWrite(bulks as any);
            console.log(upd);
        }
    }
}