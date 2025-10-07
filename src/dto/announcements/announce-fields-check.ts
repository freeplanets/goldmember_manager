import { IAnnouncement } from '../interface/announcement.if';
import { DtoErrMsg } from '../../utils/enumError';
import { isArray } from 'class-validator';
import { IReturnObj } from '../interface/common.if';

//import { DateLocale } from '../../classes/common/date-locale';

export class AnnounceFieldsCheck {
    private _annDta:Partial<IAnnouncement> | any ={};
    private _error:any;
    //private myDate = new DateLocale();
    constructor(annDta:any){
        console.log('AnnounceFieldsCheck annDta:', annDta);
        const error = {};
        let isErrorOccur = false;
        Object.keys(annDta).forEach((key) => {
            if (annDta[key]) {
                if (key === 'isPublished' && typeof(annDta.isPublished) === 'string') {
                    this._annDta.isPublished = annDta.isPublished === 'true' ? true : false;
                } else if (key === 'isTop' && typeof(annDta.isTop) === 'string') {
                    this._annDta.isTop = annDta.isTop === 'true' ? true : false;
                } else if (key === 'targetGroups' || key === 'extendFilter') {
                    if (typeof(annDta[key]) === 'string') {
                        const { data, error} = this.targetGroupCheck(annDta[key]);
                        if (error) {
                            this._error;
                        } else {
                            this._annDta[key] = data;
                        }
                    } else if (isArray(annDta[key])) {
                        this._annDta[key] = annDta[key].map((v:string) => {
                            const {data, error} = this.targetGroupCheck(v);
                            if (error) {
                                this._error;
                                return '';
                            } else {
                                //this._annDta[key] = data;
                                return data;
                            }
                            //v.trim()
                        });
                    } else {
                        isErrorOccur = true;
                        error[key] = {
                            'stylecheck': DtoErrMsg.ARRAY_STYLE_ERROR,
                            value: annDta[key],
                        }
                    }
                    // this._annDta.targetGroups = annDta.targetGroups.split(',');
                // } else if (key==='publishDate') {
                //     console.log(`publishDate: >${annDta.publishDate}<`);
                //     if (!DATE_STYLE.test(annDta.publishDate)) {
                //     //     console.log('pdate pass');
                //     //     this._annDta.publishDate = this.myDate.toDateString(annDta.publishDate);
                //     // } else {
                //         console.log("rgx test:", DATE_STYLE.test(annDta.publishDate));
                //         isErrorOccur=true;
                //         error['publishDate'] = {
                //             'stylecheck publishDate': DtoErrMsg.DATE_STYLE_ERROR,
                //             value: annDta.publishDate,
                //         }
                //     }
                // } else if (key === 'expiryDate') {
                //     if (!DATE_STYLE.test(annDta.expiryDate)) {
                //     //     this._annDta.expiryDate = this.myDate.toDateString(annDta.expiryDate);
                //     // } else {
                //         isErrorOccur = true;
                //         error['expiryDate'] = {
                //             'stylecheck2': DtoErrMsg.DATE_STYLE_ERROR,
                //             value: annDta.expiryDate,
                //         }
                //     }
                } else if (key === 'extendFilter' && typeof(annDta.extendFilter) === 'string') {
                    this._annDta.extendFilter = annDta.extendFilter.split(',').map((itm:string) => itm);
                } else if (key==='attachments') {
                    if (typeof(annDta[key])==="string") {
                        try {
                            let strX = annDta[key];
                            strX = strX.replace(/\\r\\n/g, '').replace(/'/g, '"').replaceAll('},' ,'}<split>');
                            this._annDta.attachments = strX.split('<split>').map((itm)=> eval(`(${itm})`));    
                        } catch (e) {
                            console.log('convert attachements error:', e);
                            isErrorOccur = true;
                            error['attachments'] = {
                                'stylecheck' : DtoErrMsg.ARRAY_STYLE_ERROR,
                                value: annDta[key], 
                            }                            
                        }
                    } else if (isArray(annDta[key])) {
                        this._annDta[key] = annDta[key];
                    } else {
                        isErrorOccur = true;
                        error['attachments'] = {
                            'stylecheck' : DtoErrMsg.ARRAY_STYLE_ERROR,
                            value: annDta[key], 
                        }
                    }
                } else if (typeof this._annDta[key] === 'string') {
                    
                } else {
                    this._annDta[key] = annDta[key];
                }
            }
        })
        if (isErrorOccur) {
            this._error = error;
        }
        //this._annDta = annDta;
    }
    get Data() {
        return this._annDta;
    }
    get Error() {
        return this._error;
    }
    targetGroupCheck(annDta:string):IReturnObj {
        const rtn:IReturnObj={};
        try {
            if (annDta.indexOf('[') !== -1 || annDta.indexOf('{') !== -1) {
                rtn.data = JSON.parse(annDta);
            } else {
                rtn.data = annDta.trim();
                // rtn.data = annDta.split(',').map(
                //     (v:string) => {
                //         console.log('v:', v);
                //         if (v.indexOf('{') !== -1) {
                //             return JSON.parse(v);
                //         } else {
                //             return v.trim();
                //         }
                //     }
                // );
            }
        } catch (err) {
            console.log('json parse error:', err);
            rtn.error = err;
        }
        return rtn;
    }
}