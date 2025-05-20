import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/common-response.dto';
import { ICommonResponse } from '../interface/common.if';
import { ICaptchaData } from '../interface/auth.if';
import { CaptchaData } from './captcha-data';

export class AuthSendVerificationResponseDto extends CommonResponseDto implements ICommonResponse<ICaptchaData> {
    @ApiProperty({
        description: '驗證碼(svg)',
        type: CaptchaData
    })
    data?: ICaptchaData;
}
