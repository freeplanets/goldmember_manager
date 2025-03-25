import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CommonError } from '../utils/common-exception';
import { ERROR_TYPE } from '../utils/enum';
import { ERROR_MESSAGE, STATUS_CODE } from '../utils/constant';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../dto/schemas/user.schema';
import { Model } from 'mongoose';
import { v1 as uuidv1 } from 'uuid';
import { UserCreateDataDto } from '../dto/users/user-create-data.dto';
import { USER_DEFAULT_FIELDS } from '../utils/base-fields-for-searh';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel:Model<UserDocument>){}

  async usersGet(search: string) {
    if (search.indexOf('*') !== -1) return false;
    return this.userModel.find({ $or: [
      {username: {$regex: `.*${search}.*`}},
      {displayName: {$regex: `.*${search}.*`}}
    ]}, USER_DEFAULT_FIELDS);
  }

  async usersPost(
    userCreate: UserCreateDataDto,
    // req: Request,
  ) {
    if (!userCreate.id) userCreate.id = uuidv1();
    const user = new this.userModel(userCreate);
    return user.save();
  }

  async usersId(id: string): Promise<any> {
    try {
      return this.userModel.findOne({id});
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async usersPutId(
    id: string,
    usersIdPutRequestDto: UserCreateDataDto,
  ): Promise<any> {
    try {

      return this.userModel.updateOne({id}, usersIdPutRequestDto)
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async usersIdStatus(id: string, isActive: boolean): Promise<any> {
    try {
      return this.userModel.updateOne({id}, {isActive});
    } catch (e) {
      throw new CommonError(
        e.type || ERROR_TYPE.SYSTEM,
        e.status || STATUS_CODE.FAIL,
        e.status ? e.clientErrorMessage : ERROR_MESSAGE.SERVER_ERROR,
        e.message,
      );
    }
  }

  async usersIdReset2Fa(id: string): Promise<any> {
    try {
      return this.userModel.updateOne({id}, {SecretCode: '', has2Fa: false});
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
