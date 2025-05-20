import { ApiProperty } from "@nestjs/swagger";
import { ICommonError } from "../interface/common.if";

export class CommonErrorDto implements ICommonError{
    @ApiProperty({
        description: '其他錯誤訊息',
    })
    message?: string;
    @ApiProperty({
        description: '系統抛出的錯誤訊息',
        example: { Error: 'some error message'},
    })
    extra?: any;
}