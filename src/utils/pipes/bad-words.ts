import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as BadWords from 'bad-words-chinese';
import { isArray, isObject } from 'class-validator';
import { BadWordsException } from '../validate/bad-words-exception';
import { ErrCode } from '../enumError';
const badwords = new BadWords();

const hasBadWords = (data:any) => {
    //console.log('hasBadWords:', data)
    let isBad = false;
    if (typeof(data) === 'string') {
        //console.log('badwords check1:', data);
        isBad = badwords.isProfane(data);
        if (isBad) return true;
    } else if (isArray(data)) {
        //console.log('badwords check2');
        for (let i=0, n=data.length; i < n; i+=1) {
            let dta = data[i];
        // }   
        // data.every((dta) => {
            isBad = hasBadWords(dta);
            //console.log('badwords:', dta, isBad);
            if (isBad) break; //return true;
        //})
        }
        if (isBad) return true;
    } else if (isObject(data)) {
        //console.log('badwords check3')
        const keys = Object.keys(data);
        for(let i=0,n=keys.length; i < n; i+=1) {
            let key = keys[i];

        // }
        // Object.keys(data).every((key) => {
            //console.log(key, ':', data[key]);
            isBad = hasBadWords(data[key]);
            //console.log('badwords:', data[key], isBad);
            if (isBad)  break; //return true;
        //});
        }
        if (isBad) return true;
    }
    return false;
} 

export class BadWordsPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        //console.log('badwordspipe:', value);
        const hasBadWord = hasBadWords(value);
        //console.log('End badwords check');
        if (hasBadWord) {
            throw BadWordsException(ErrCode.BAD_WORD_DETECTED); 
        }
        return value;
    }
}
