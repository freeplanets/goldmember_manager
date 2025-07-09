import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { ITimeslots, ITimeslotsValue } from '../../utils/settings/settings.if';
import { ApiProperty } from '@nestjs/swagger';
import { TimeslotsDto } from './timeslots.dto';

export class TimeslotsResponse extends CommonResponseDto implements ICommonResponse<ITimeslots[]> {
    @ApiProperty({
        description: '預約時段設定值',
        type: TimeslotsDto,
        isArray: true,
    })
    data?: ITimeslots[];
}