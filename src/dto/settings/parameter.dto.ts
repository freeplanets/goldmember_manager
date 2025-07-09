import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { ParamTypes } from '../../utils/settings/settings.enum';
import { IGrading, INofication, IParameter, ITimeslotsValue, IValueScore } from '../../utils/settings/settings.if';
import { ValueScoreDto } from './value-score.dto';
import { NoficationDto } from './nofication.dto';
import { GradingDto } from './grading.dto';
import { TimeslotsValueDto } from './timeslots-value.dto';

export class ParameterDto implements IParameter<IValueScore | INofication | IGrading | ITimeslotsValue> {
    @ApiProperty({
        description: '參數類別',
        required: false,
        enum: ParamTypes,
        example: ParamTypes.APP_SETTINGS,
    })
    @IsOptional()
    @IsString()
    id: ParamTypes;

    @ApiProperty({
        description: '參數KEY值',
        required: false,
    })
    @IsOptional()
    @IsString()
    key: string;
    @ApiProperty({
        description: '參數值-會員或團體評級',
        required: false,
        type: ValueScoreDto,
    })
    @ApiProperty({
        description: '參數值-通知',
        required: false,
        type: NoficationDto,
    })
    @ApiProperty({
        description: '參數值-評分標準',
        required: false,
        type: GradingDto,
    })
    @ApiProperty({
        description: '參數值-預約時段設定',
        required: false,
        type: TimeslotsValueDto,
    })
    @IsOptional()
    @IsObject()
    value: IValueScore | INofication | IGrading | ITimeslotsValue;

    @ApiProperty({
        description: '參數描述',
        required: false,
    })
    @IsOptional()
    @IsString()
    description: string;
}