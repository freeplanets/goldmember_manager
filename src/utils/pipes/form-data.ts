import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FormDataPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(metadata);
        console.log(typeof value);
        console.log(value);
        if (metadata.type === 'body' && typeof value === 'object') {
            const newValue = {}
            try {
                Object.keys(value).forEach((key) => {
                    if (value[key] && value[key].indexOf('"') !== -1) {
                        //value[key] = JSON.parse(value[key]);
                        newValue[key] = JSON.parse(value[key]); 
                    } else if (typeof value[key]==='string') {
                        if (value[key]) newValue[key] = value[key];
                    } else {
                       newValue[key] = value[key]; 
                    }
                });
                value = newValue;
                console.log('value after:', value);
            } catch (error) {
                console.log('FormDataPipe:', error);
            }
        }
        return value;
    }
}