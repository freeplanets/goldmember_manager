import { ApiProperty } from '@nestjs/swagger';
import { IFairway } from '../interface/field-management.if';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { FAIRWAY_PATH } from '../../utils/enum';
import { Transform } from 'class-transformer';

export class FairwayModifyQueryDto implements Partial<IFairway> {
    @ApiProperty({
        description: '球道區域',
        enum: FAIRWAY_PATH,
        example: FAIRWAY_PATH.EAST,
    })
    course:string;

    @ApiProperty({
        description: '球道號碼 (1-9)',
    })
    @Transform(({value}) => {
        return parseInt(value);
    })
    fairway?: number;
}