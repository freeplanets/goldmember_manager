import { ApiProperty } from '@nestjs/swagger';
import { IScoreLevel, IScoreObject } from '../../utils/settings/settings.if';
import { ScoreLevelDto } from './score-level.dto';
import { IsObject, IsOptional } from 'class-validator';

export class ScoreObjectDto implements IScoreObject {
    @ApiProperty({
        description: '一般等級',
        required: false,
        type: ScoreLevelDto,
    })
    @IsOptional()
    @IsObject()
    common?: IScoreLevel;   // 一般等級

    @ApiProperty({
        description: '青銅等級',
        required: false,
        type: ScoreLevelDto,
    })
    @IsOptional()
    @IsObject()
    bronze?: IScoreLevel;   // 青銅等級

    @ApiProperty({
        description: '銀等級',
        required: false,
        type: ScoreLevelDto,
    })
    @IsOptional()
    @IsObject()
    silver?: IScoreLevel;   // 銀等級

    @ApiProperty({
        description: '金等級',
        required: false,
        type: ScoreLevelDto,
    })
    @IsOptional()
    @IsObject()
    gold?: IScoreLevel;  // 金等級

    @ApiProperty({
        description: '白金等級',
        required: false,
        type: ScoreLevelDto,
    })
    @IsOptional()
    @IsObject()
    platinum?: IScoreLevel; // 白金等級
}