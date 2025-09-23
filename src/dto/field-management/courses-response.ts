import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { ApiProperty } from "@nestjs/swagger";
import { ICourse } from "../interface/field-management.if";

export class CoursesRes extends CommonResponseDto implements ICommonResponse<ICourse[]> {
    @ApiProperty({
        description: '組合區域列表'
    })
    data?: ICourse[];
}