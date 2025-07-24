import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { isArray, isObject } from "class-validator";

@Injectable()
export class FileNamePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log("metadata:", metadata, metadata.metatype);
        if (isObject(metadata.metatype)) {
            Object.keys(metadata.metatype).forEach((m) => {
                console.log('metatype:', m);
            });
        } else {
            console.log("not a array");
        }
        console.log("value:", value)
        if (metadata.type === 'body' && metadata.data === 'file') {
            const file = value as Express.Multer.File;
            if (file && file.originalname) {
                file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
                console.log('originalname:', file.originalname);
            }
        }
        return value;
    }
}