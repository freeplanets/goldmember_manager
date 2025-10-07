import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IMember } from '../dto/interface/member.if';
import { DevicesResponse } from '../dto/devices/devices-response';
import { ErrCode } from '../utils/enumError';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { User, UserDocument } from '../dto/schemas/user.schema';

@Injectable()
export class DevicesService {
    constructor(@InjectModel(User.name) private readonly modelUser:Model<UserDocument>){}
    async getDevices(user:Partial<IMember>):Promise<DevicesResponse> {
        const devRes = new DevicesResponse();
        try {
            const mbr = await this.modelUser.findOne({id: user.id}, 'devices');
            if (mbr) {
                devRes.data = mbr.devices;
            }
        } catch (e) {
            console.log('getDevices Error:', e);
            devRes.ErrorCode = ErrCode.ERROR_PARAMETER;
            devRes.error.extra = e;
        }
        return devRes;
    }
    async delDevice(user:Partial<IMember>, deviceId:string):Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            const mbr = await this.modelUser.findOne({id: user.id}, 'devices');
            if (mbr.devices && mbr.devices.length > 0) {
                const devices = mbr.devices;
                const newList = [];
                devices.forEach((itm) => {
                    if (itm.deviceId !== deviceId) {
                        newList.push(itm);
                    }
                });
                const upd = await this.modelUser.updateOne({id: user.id}, {devices: newList});
                console.log('delDevice upd:', upd);
            }
        } catch (e) {
            console.log('getDevices Error:', e);
            comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
            comRes.error.extra = e;            
        }
        return comRes;
    }
}