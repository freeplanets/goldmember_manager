import { Injectable } from '@nestjs/common';
import { LEVEL } from '../utils/enum';
import { PHONE_STYLE_FOR_SEARCH } from '../utils/constant';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../dto/schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';
import { USER_DEFAULT_FIELDS, USER_DETAIL_FIELDS } from '../utils/base-fields-for-searh';
import { IUser } from '../dto/interface/user.if';
import { UserPutDataDto } from '../dto/users/user-put-data.dto';
import { ErrCode } from '../utils/enumError';
import { UserModifyPassDto } from '../dto/users/user-modify-pass.dto';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { UsersIdResponseDto } from '../dto/users/users-id-response.dto';
import { UsersResponseDto } from '../dto/users/users-response.dto';
import { isNotEmpty, isNumberString } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel:Model<UserDocument>){}

  async usersGet(search: string, user:Partial<IUser>):Promise<UsersResponseDto> {
    console.log('userGet search:', search);
    const userRes = new UsersResponseDto();
    if (search === 'showall' && user.authRole === LEVEL.ADMIN) {
      userRes.data = await this.userModel.find();
      return userRes;
    }
    const filter:FilterQuery<IUser> = {}
    switch(user.authRole) {
      case LEVEL.MANAGER:
        filter.authRole = { $ne: LEVEL.ADMIN };
        break;
      case LEVEL.WORKER:
      case LEVEL.RECEPTION:
        filter.$and = [
          {authRole: { $ne: LEVEL.ADMIN } },
          {authRole: { $ne: LEVEL.MANAGER} }
        ];
        break;
    }
    // if (user.authRole !== LEVEL.ADMIN) {
    //   filter.authRole = { $ne: LEVEL.ADMIN };
    // }
    if (isNotEmpty(search)) {
      if (isNumberString(search)) {
        if(search.length < 3) {
          userRes.ErrorCode = ErrCode.ERROR_PARAMETER;
          userRes.error.extra = 'at least 3 digitals';
          return userRes;
        }
      }
      if (PHONE_STYLE_FOR_SEARCH.test(search)) {
        filter.phone = { $regex: `${search}.*`}
      } else {
        // if (search.indexOf('*') !== -1) return false;
        filter.$or = [
          {username: {$regex: `.*${search}.*`}},
          {displayName: {$regex: `.*${search}.*`}}
        ];
      }
    }
    console.log('user get filter:', filter);
    const rlt = await this.userModel.find(filter, USER_DEFAULT_FIELDS);
    if (rlt) userRes.data = rlt;
    return userRes;
  }

  async usersPost(
    userCreate: Partial<IUser>,
    // req: Request,
    user:Partial<IUser>,
  ):Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    const myRole = user.authRole;
    try {
      if (userCreate.authRole === LEVEL.MANAGER || userCreate.authRole == LEVEL.ADMIN) {
        if (myRole !== LEVEL.ADMIN) {
          comRes.ErrorCode = ErrCode.INSUFFICENT_PERMISSIONS;
          return comRes;
        }
      }
      if (!userCreate.id) userCreate.id = uuidv1();
      const user = new this.userModel(userCreate);
      const rlt = await user.save();
      if (!rlt) comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async usersId(id: string): Promise<UsersIdResponseDto> {
    const uidRes = new UsersIdResponseDto();
    try {
      const rlt = await this.userModel.findOne({id}, USER_DETAIL_FIELDS);
      if (!rlt) uidRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      else uidRes.data = rlt 
    } catch (e) {
      uidRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      uidRes.error = {
        extra: e,
      }
    }
    return uidRes;
  }

  async usersPutId(
    id: string,
    usersIdPutRequestDto: UserPutDataDto,
    user:Partial<IUser>,
  ): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    const myRole = user.authRole;
    const modifyiedRole = usersIdPutRequestDto.authRole;
    //console.log('usersPutId:', usersIdPutRequestDto);
    try {
      if ( modifyiedRole === LEVEL.ADMIN || modifyiedRole === LEVEL.MANAGER) {
        if (myRole !== LEVEL.ADMIN) {
          comRes.ErrorCode = ErrCode.INSUFFICENT_PERMISSIONS;
          return comRes;
        }
      }
      let rlt:any;
      rlt = await this.userModel.findOne({id}, 'authRole');
      if (rlt) {
        if ((rlt.authRole === LEVEL.ADMIN || rlt.authRole === LEVEL.MANAGER) && myRole !== LEVEL.ADMIN){ 
          comRes.ErrorCode = ErrCode.INSUFFICENT_PERMISSIONS;
        } else {
          rlt = await this.userModel.updateOne({id}, usersIdPutRequestDto);
          // if (!rlt) comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
        }
      } else  {
        comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      }  
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async usersIdStatus(id: string, isActive: boolean): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const rlt = await this.userModel.updateOne({id}, {isActive});
      // if (!rlt) comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }

  async usersIdReset2Fa(id: string, req:any): Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const user:Partial<IUser> = req.user;
      if (user.id === id || user.authRole === LEVEL.ADMIN || user.authRole === LEVEL.MANAGER) {
        const rlt = await this.userModel.updateOne({id}, {SecretCode: '', has2Fa: false});
        // if (rlt) comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
        console.log('update', rlt);
      } else {
        comRes.ErrorCode = ErrCode.INSUFFICENT_PERMISSIONS;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
  async modifyPassword(mpass:UserModifyPassDto, user:Partial<IUser>):Promise<CommonResponseDto> {
    const comRes = new CommonResponseDto();
    try {
      const usr = await this.userModel.findOne({id:user.id, isActive: true}, 'password');
      if (usr) {
        const isPass = await usr.schema.methods.comparePassword(mpass.oldPassword, usr.password);
        console.log('modify isPass', isPass);
        if (isPass) {
          const upd = await this.userModel.updateOne({id:user.id}, {password: mpass.newPassword});
          console.log("modify upd", upd);
          //if (!upd) comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
        } else {
          comRes.ErrorCode = ErrCode.ACCOUNT_OR_PASSWORD_ERROR;
        }
      } else {
        comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
      }
    } catch (e) {
      comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
      comRes.error.extra = e;
    }
    return comRes;
  }
}
