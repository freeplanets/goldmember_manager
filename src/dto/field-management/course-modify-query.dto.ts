import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class CourseModifyQueryDto {
    @ApiProperty({
        description: '組合賽道索引 (0-2)',
        required: true,
        maximum: 2,
        minimum: 0,
    })
    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(2)
    courseIndex:number;
}