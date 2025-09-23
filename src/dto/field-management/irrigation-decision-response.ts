import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { IrrigationDecisionDta } from './irrigation-decision.dta';

export class IrrigationDecisionRes extends CommonResponseDto implements ICommonResponse<IrrigationDecisionDta[]> {
    @ApiProperty({
        description: '果嶺灌溉決策記錄',
        type: IrrigationDecisionDta,
    })
    data?: IrrigationDecisionDta[];
}