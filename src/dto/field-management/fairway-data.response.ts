import { IRangeFairway } from '../../classes/field-management/fairway-op';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { ApiProperty } from '@nestjs/swagger';

export class FairwayDataRes extends CommonResponseDto implements ICommonResponse<IRangeFairway> {
    @ApiProperty({
        description: '區域球道列表',
    })
    data?: IRangeFairway;
}