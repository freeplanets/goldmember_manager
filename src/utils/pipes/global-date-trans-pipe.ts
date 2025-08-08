import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { DATE_STYLE } from '../constant';
import { DateLocale } from '../../classes/common/date-locale';

const myDate = new DateLocale()
const ObjDataChk = (val:object) => {
    Object.keys(val).forEach((key) => {
        //let v = val[key];
        //console.log('name value:', key, val[key]);
        if (typeof val[key] === 'object' && val[key] !== null) {
            return ObjDataChk(val[key]);
        } else if (typeof val[key] === 'string') {
            if (DATE_STYLE.test(val[key])) {
                val[key] = myDate.toDateString(val[key], '/');
            } else if (!val[key] && typeof(val[key]) !== 'undefined') {
                // val[key] = undefined;
                delete val[key];
            }
        }
        return val[key];
    })
    //return val;
}

@Injectable()
export class GlobalDataTransPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // console.log('GlobalDataTransPipe:', value, metadata);
        if (typeof value === 'string') {
            if (DATE_STYLE.test(value)) {
                // value = value.replaceAll('-','/');
                value = myDate.toDateString(value, '/');
            }
        }
        if (typeof value === 'object' && value !== null) {
            ObjDataChk(value);
            // for (const key in value) {
            //     if (typeof value[key] === 'string') {
            //         if (DATE_STYLE.test(value[key])) {
            //             //value[key] = value[key].replaceAll('-','/');
            //             value[key] = myDate.toDateString(value[key], '/');
            //             console.log('change to:', value[key])
            //         } else if (!value[key]) {
            //             value[key] = undefined;
            //         }
            //     }
            // }
        }
        //console.log('GlobalDataTransPipe after:', value);
        return value;
    }
}
