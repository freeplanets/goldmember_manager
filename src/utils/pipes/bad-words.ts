import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as BadWords from 'bad-words-chinese';
import { isArray, isObject } from 'class-validator';
import { BadWordsException } from '../validate/bad-words-exception';
import { ErrCode } from '../enumError';
const badwords = new BadWords();

const hasBadWords = (data:any) => {
    let isBad = false;
    if (typeof(data) === 'string') {
        isBad = badwords.isProfane(data);
        if (isBad) return true;
    } else if (isArray(data)) {
        data.every((dta) => {
            isBad = hasBadWords(dta);
            if (isBad) return false;
        })
        if (isBad) return true;
    } else if (isObject(data)) {
        Object.keys(data).every((key) => {
            isBad = hasBadWords(data[key]);
            if (isBad) return false;
        });
        if (isBad) return true;
    }
    return false;
} 

export class BadWordsPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('badwordspipe:', value);
        const hasBadWord = hasBadWords(value);
        if (hasBadWord) {
            throw BadWordsException(ErrCode.BAD_WORD_DETECTED); 
        }
        return value;
    }
}
