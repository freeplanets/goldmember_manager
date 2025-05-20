import { DateWithLeadingZeros } from '../../utils/common';
import { IAnnouncement } from '../interface/announcement.if';
import { DATE_STYLE } from '../../utils/constant';
import { DtoErrMsg } from '../../utils/enumError';
import { isArray } from 'class-validator';
import { MEMBER_EXTEND_GROUP } from '../../utils/enum';

export class AnnounceFieldsCheck {
    private _data:Partial<IAnnouncement> | any ={};
    private _error:any;
    constructor(data:any){
        console.log('AnnounceFieldsCheck data:', data);
        const error = {};
        let isErrorOccur = false;
        //const regexDate = DATE_STYLE;
        Object.keys(data).forEach((key) => {
            if (data[key]) {
                if (key === 'isPublished' && typeof(data.isPublished) === 'string') {
                    this._data.isPublished = data.isPublished === 'true' ? true : false;
                } else if (key === 'isTop' && typeof(data.isTop) === 'string') {
                    this._data.isTop = data.isTop === 'true' ? true : false;
                } else if (key === 'targetGroups' || key === 'extendFilter') {
                    if (typeof(data[key]) === 'string') {
                        this._data[key] = data[key].split(',').map((v:string) => v.trim());
                    } else if (isArray(data[key])) {
                        this._data[key] = data[key].map((v:string) => v.trim());
                    } else {
                        isErrorOccur = true;
                        error[key] = {
                            'stylecheck': DtoErrMsg.ARRAY_STYLE_ERROR,
                            value: data[key],
                        }
                    }
                    // this._data.targetGroups = data.targetGroups.split(',');
                } else if (key==='publishDate') {
                    console.log(`publishDate: >${data.publishDate}<`);
                    //if (DATE_STYLE.test(data.publishDate)) {
                    if (DATE_STYLE.test(data.publishDate)) {
                        console.log('pdate pass');
                        this._data.publishDate = DateWithLeadingZeros(data.publishDate);
                    } else {
                        console.log("rgx test:", DATE_STYLE.test(data.publishDate));
                        isErrorOccur=true;
                        error['publishDate'] = {
                            'stylecheck publishDate': DtoErrMsg.DATE_STYLE_ERROR,
                            value: data.publishDate,
                        }
                    }
                } else if (key === 'expiryDate') {
                    if (DATE_STYLE.test(data.expiryDate)) {
                        this._data.expiryDate = DateWithLeadingZeros(data.expiryDate);
                    } else {
                        isErrorOccur = true;
                        error['expiryDate'] = {
                            'stylecheck2': DtoErrMsg.DATE_STYLE_ERROR,
                            value: data.expiryDate,
                        }
                    }
                } else if (key === 'extendFilter' && typeof(data.extendFilter) === 'string') {
                    this._data.extendFilter = data.extendFilter.split(',').map((itm:string) => itm);
                } else if (key==='attachments') {
                    if (typeof(data[key])==="string") {
                        try {
                            let strX = data[key];
                            strX = strX.replace(/\\r\\n/g, '').replace(/'/g, '"').replaceAll('},' ,'}<split>');
                            this._data.attachments = strX.split('<split>').map((itm)=> eval(`(${itm})`));    
                        } catch (e) {
                            console.log('convert attachements error:', e);
                            isErrorOccur = true;
                            error['attachments'] = {
                                'stylecheck' : DtoErrMsg.ARRAY_STYLE_ERROR,
                                value: data[key], 
                            }                            
                        }
                    } else if (isArray(data[key])) {
                        this._data[key] = data[key];
                    } else {
                        isErrorOccur = true;
                        error['attachments'] = {
                            'stylecheck' : DtoErrMsg.ARRAY_STYLE_ERROR,
                            value: data[key], 
                        }
                    }
                } else {
                    this._data[key] = data[key];
                }
            }
        })
        if (isErrorOccur) {
            this._error = error;
        }
        //this._data = data;
    }
    get Data() {
        return this._data;
    }
    get Error() {
        return this._error;
    }
}