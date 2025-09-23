import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { HolidayDta } from './holiday-data';

export class HolidaysRes extends CommonResponseDto implements ICommonResponse<HolidayDta[]> {
    @ApiProperty({
        description: '假日清單',
        type: HolidayDta,
        isArray: true,
    })
    data?: HolidayDta[];
}