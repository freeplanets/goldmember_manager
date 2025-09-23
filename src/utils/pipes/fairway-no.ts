import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FairwayNoPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value == 'string') {
            value = parseInt(value);
        }
        if (value > 9) value = 9;
        if (value< 1) value = 1;
        return value;
    }
}