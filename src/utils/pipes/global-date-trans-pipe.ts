import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { DATE_DASH_STYLE } from "../constant";

@Injectable()
export class GlobalDataTransPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('GlobalDataTransPipe:', value, metadata);
        if (typeof value === 'string') {
            if (DATE_DASH_STYLE.test(value)) {
                value = value.replaceAll('-','/');
            }
        }
        if (typeof value === 'object' && value !== null) {
            for (const key in value) {
                if (typeof value[key] === 'string') {
                    if (DATE_DASH_STYLE.test(value[key])) {
                        value[key] = value[key].replaceAll('-','/');
                    }
                }
            }
        }
        console.log('GlobalDataTransPipe after:', value);
        return value;
    }
}