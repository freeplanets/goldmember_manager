import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { MembersDirectorStatusRequestDto } from '../dto/members/members-director-status-request.dto';
import { MembersConvertToShareholderRequestDto } from '../dto/members/members-convert-to-shareholder-request.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Member, MemberDcoument } from '../dto/schemas/member.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { MEMBER_DEFAULT_FIELDS } from '../utils/base-fields-for-searh';
import { IMember } from '../dto/interface/member.if';
import { IModifiedBy } from '../dto/interface/modifyed-by.if';
import { KsMember, KsMemberDocument } from '../dto/schemas/ksmember.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel:Model<MemberDcoument>,
    @InjectModel(KsMember.name) private ksMemberModel:Model<KsMemberDocument>,
    @InjectConnection() private readonly connection:mongoose.Connection,
  ){}
  async members(search: string, type: string = ''): Promise<any> {
    try {
      if (search.indexOf('*') !== -1) return false;
      const filter:FilterQuery<IMember> = {
        $or: [
          {username: {$regex: `.*${search}.*`}},
          {displayName: {$regex: `.*${search}.*`}}
        ],
      }
      if (type && type.indexOf('*') === -1) {
        filter.membershipType = type;
      }
      return this.memberModel.find(filter, MEMBER_DEFAULT_FIELDS);      
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async membersId(id: string): Promise<any> {
    try {
      return this.memberModel.findOne({id});
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async membersIdDirectorStatus(
    id: string,
    membersDirectorStatusRequestDto: MembersDirectorStatusRequestDto,
  ): Promise<any> {
    try {
      const f = await this.memberModel.findOne({id}, 'isDirector');
      if (f) {
        const modifier:IModifiedBy = {
          modifiedBy: '',
          modifiedAt: new Date().toLocaleString(),
          lastValue: f.isDirector,
        }
        return this.memberModel.findOneAndUpdate(
          {id}, 
          {
            isDirector: membersDirectorStatusRequestDto.isDirector,
            directorStatusLastModified: modifier,
          }
        );
      }
      return false;
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async membersConvertToShareholder(
    membersConvertToShareholderRequestDto: MembersConvertToShareholderRequestDto,
    req:Request,
  ): Promise<any> {
    try {
      const {id, membershipType, systemId } = membersConvertToShareholderRequestDto;
      const { user } = req as any;
      const member = await this.memberModel.findOne({id}, 'membershipType');
      if (member) {
        const ksmember = await this.ksMemberModel.findOne({no: systemId});
        if (ksmember) {
          const session = await this.connection.startSession();
          const modifier:IModifiedBy = {
            modifiedBy: user.id,
            modifiedAt: new Date().toLocaleDateString(),
            lastValue: member.membershipType,
          }
          const saveMember = await this.memberModel.updateOne({id},{
            membershipType: membershipType,
            membershipLastModified: modifier,
            systemId: systemId,
          });
          const saveKs = await this.ksMemberModel.updateOne({no: systemId}, {appUser: id});
          if (saveKs && saveKs) {
            session.commitTransaction();
            return true;
          } else {
            session.abortTransaction();
          } 
        }
        return false;
      }
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }
}
