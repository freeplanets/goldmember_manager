import { ApiProperty } from '@nestjs/swagger';
import { IScoreObject, IValueScore } from '../../utils/settings/settings.if';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { ScoreObjectDto } from './score-object.dto';

export class ValueScoreDto implements IValueScore {
    @ApiProperty({
        description: '取消預約前的最小小時數',
        required: false,
        example: 24,
    })
    @IsOptional()
    @IsNumber()
    app_cancel_hours: number;   // 取消預約前的最小小時數

    @ApiProperty({
        description: '股東等級設定',
        required: false,
        type: ScoreObjectDto,
    })
    @IsOptional()
    @IsObject()
    shareholder: IScoreObject;  // 股東等級設定

    @ApiProperty({
        description: '團隊等級設定',
        required: false,
        type: ScoreObjectDto,
    })
    @IsOptional()
    @IsObject()    
    team: IScoreObject; // 團隊等級設定

    @ApiProperty({
        description: '成員等級設定',
        required: false,
        type: ScoreObjectDto,
    })
    @IsOptional()
    @IsObject()
    member: IScoreObject; // 成員等級設定
}