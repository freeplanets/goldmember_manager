import { IGrading, INofication, IParameter, ITimeslotsValue, IValueScore } from '../../utils/settings/settings.if';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { ApiProperty } from '@nestjs/swagger';
import { ParameterDto } from './parameter.dto';

export class SettingsResponse extends CommonResponseDto implements ICommonResponse<IParameter<IValueScore | INofication | IGrading | ITimeslotsValue>[]> {
    @ApiProperty({
        description: '參數值',
        type: ParameterDto,
    })
    data?: IParameter<IValueScore | INofication | IGrading | ITimeslotsValue>[];
}