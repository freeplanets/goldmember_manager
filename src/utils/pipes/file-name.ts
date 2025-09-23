import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isArray, isObject } from 'class-validator';
//import { getBadFilesOp } from '../../classes/announcements/context-check/bad-file-op';
import * as BadWords from 'bad-words-chinese';
import { BadWordsImageException } from '../validate/bad-words-image-exception';

export function isChinese(str: string): boolean {
  // 檢查是否包含中文
  return /[\u4e00-\u9fff]/.test(str);
}

export function isEncodedURIComponent(str: string): boolean {
  // 檢查是否包含 %XX（XX 為兩位十六進位數字）
  return /%[0-9A-Fa-f]{2}/.test(str);
}    

export function confirmFileName(file:Express.Multer.File) {
  if (!isChinese(file.originalname)) {
      if (isEncodedURIComponent(file.originalname)) {
          file.originalname = decodeURIComponent(file.originalname);
      } else {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      }
  }
  console.log('after confirmFileName:', file.originalname);
}

@Injectable()
export class FileNamePipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const tmp:Express.Multer.File[] = [];
        if (isArray(value)) {
            const files = value as Express.Multer.File[];
            files.forEach((file) => {
                confirmFileName(file);
                tmp.push(file);
            });
        } else {
            const file = value as Express.Multer.File;
            if (file && file.originalname) {
                confirmFileName(file);
                // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
                console.log('originalname:', file.originalname);
                tmp.push(file);
            }
        }
        // if (tmp.length > 0) {
        //     const badFilesOp = getBadFilesOp(new BadWords());
        //     for (let i=0, n=tmp.length;i<n;i++) {
        //         await badFilesOp.check(tmp[i]);
        //         if (badFilesOp.Error) {
        //             throw BadWordsImageException(badFilesOp.Error);
        //         }
        //     }
        // }
        return value;
    }
}