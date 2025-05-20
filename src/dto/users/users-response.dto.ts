import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interface/user.if';
import { ICommonResponse } from '../interface/common.if';
import { extend } from 'dayjs';
import { CommonResponseDto } from '../common/common-response.dto';
import { UserBaseDataDto } from './user-base-data.dto';

export class UsersResponseDto extends CommonResponseDto implements ICommonResponse<UserBaseDataDto[]> {
    @ApiProperty({
        description: '使用者列表',
        isArray: true,
        type: UserBaseDataDto,
    })
    data?: UserBaseDataDto[];
}
