import { ApiProperty } from "@nestjs/swagger";
import { ITeeInfo } from "../interface/field-management.if";

export class TeeData implements ITeeInfo {
    @ApiProperty({
        description: '球場難度係數',
    })
    rating: number;

    @ApiProperty({
        description: '斜度係數',
    })
    slope: number;
}