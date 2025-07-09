import { ApiProperty } from '@nestjs/swagger';
import { ITimeslots, ITimeslotsValue } from '../../utils/settings/settings.if';
import { TimeslotsDto } from './timeslots.dto';
import { IsArray, IsOptional } from 'class-validator';

export class TimeslotsValueDto implements ITimeslotsValue {
    @ApiProperty({
        description: '時段資訊',
        type: TimeslotsDto,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    timeslots: ITimeslots[];
}