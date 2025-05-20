import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';

export class AnnouncementsFilterResponseDto extends CommonResponseDto implements ICommonResponse<number> {
    @ApiProperty({
        description: '會員數',
    })
    data?: number;
}
