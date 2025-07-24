import { Injectable } from '@nestjs/common';
import { ParamTypes } from '../utils/settings/settings.enum';
import { InjectModel } from '@nestjs/mongoose';
import { SystemParameter, SystemParameterDocument } from '../dto/schemas/system-parameter.schema';
import { FilterQuery, Model } from 'mongoose';
import { systemParameters } from '../utils/settings/settings';
import { CommonResponseDto } from '../dto/common/common-response.dto';
import { ICommonResponse } from '../dto/interface/common.if';
import { ErrCode } from '../utils/enumError';
import { SettingsResponse } from '../dto/settings/settings.response';
import { SystemParamCheck } from '../utils/common';
import { TimeslotsResponse } from '../dto/settings/timeslots-response';
import { ITimeslots, ITimeslotsValue } from '../utils/settings/settings.if';


@Injectable()
export class SystemParameterService {
    constructor(@InjectModel(SystemParameter.name) private readonly modelSP:Model<SystemParameterDocument>){}
    async init(){
        const comRes:ICommonResponse<any> = new CommonResponseDto();
        //const key:ParamTypes = ParamTypes.APP_SETTINGS;
        try {
            const ans = await this.modelSP.find();
            console.log('init ans:', ans);
            if (ans.length === 0) {
                const rlt = await this.modelSP.insertMany(systemParameters);
                console.log('init rlt:', rlt);
                if (rlt) {
                    comRes.data = rlt;
                } else {
                    comRes.ErrorCode = ErrCode.DATABASE_ACCESS_ERROR;
                }
            } else {
                comRes.data = ans;
            }
        } catch(error) {
            console.log('params init error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE,
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async getParameters(id?:ParamTypes | string):Promise<SettingsResponse>{
        const comRes = new SettingsResponse();
        try {
            const filter:FilterQuery<SystemParameterDocument> = {}
            if (id && id !== '{id}') filter.id = id;
            console.log('filter:', filter);
            const ans = await this.modelSP.find(filter);
            if (ans) {
                comRes.data = ans;
            } else {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            }
        } catch(error) {
            console.log('getParameters error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async modifyParameters(id:string, value:Object):Promise<CommonResponseDto> {
        const comRes = new CommonResponseDto();
        try {
            const param = await this.modelSP.findOne({id});
            if (param) {
                const pass = SystemParamCheck(param.value, value);
                console.log('pass:', pass);
                if (pass) {
                    const upd = await this.modelSP.updateOne({id}, {value});
                    console.log('upd', upd);
                    if (!upd.acknowledged) {
                        comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
                    }
                } else {
                    comRes.ErrorCode = ErrCode.ERROR_PARAMETER;
                }
            } else {
                comRes.ErrorCode = ErrCode.ITEM_NOT_FOUND;
            }
        } catch (error) {
            console.log('modifyParameters error:', error)
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async getParamReservation() {
        const comRes = new TimeslotsResponse();
        try {
            const ans = await this.modelSP.findOne({id: ParamTypes.RESERVATION});
            if (ans) {
                comRes.data = (ans.value as ITimeslotsValue).timeslots;
            }
        } catch(error) {
            console.log('getParamReservation error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
    async modifyParamReservation(timeslots:ITimeslots[]) {
        const comRes = new CommonResponseDto();
        try {
            const ans = await this.modelSP.findOne({id: ParamTypes.RESERVATION});
            if (ans) {
                //comRes.data = (ans.value as ITimeslotsValue).timeslots;
                const upd = await this.modelSP.updateOne(
                    {id: ParamTypes.RESERVATION},
                    {value: {timeslots}},
                )
                console.log('modifyParamReservation:', upd);
            }        
        } catch (error) {
            console.log('modifyParamReservation error:', error);
            comRes.ErrorCode = ErrCode.UNEXPECTED_ERROR_ARISE;
            comRes.error.extra = error.message;
        }
        return comRes;
    }
}