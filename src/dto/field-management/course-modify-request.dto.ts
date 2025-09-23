import { ApiProperty } from '@nestjs/swagger';
import { ICourse, ITee, ITeeInfo } from '../interface/field-management.if';
import { TeeReqDto } from './tee-request.dto';

export class CourseModifyReqDto implements Partial<ICourse> {
    @ApiProperty({
        description: '球區組合',
        type:String,
        isArray: true,
    })
    zones?: string[];

    @ApiProperty({
        description: '發球區組合',
        type:TeeReqDto,
        isArray: true,
    })
    tees?: ITee[];
    // @ApiProperty({
    //     description: '藍 Tee',
    //     type: TeeReqDto,
    //     required: false,
    // })
    // @IsOptional()
    // @IsObject()
    // blueTee: ITeeInfo;

    // @ApiProperty({
    //     description: '白 Tee',
    //     type: TeeReqDto,
    //     required: false,
    // })
    // @IsOptional()
    // @IsObject()    
    // whiteTee: ITeeInfo;

    // @ApiProperty({
    //     description: '紅 Tee',
    //     type: TeeReqDto,
    //     required: false,
    // })
    // @IsOptional()
    // @IsObject()    
    // redTee: ITeeInfo;
}