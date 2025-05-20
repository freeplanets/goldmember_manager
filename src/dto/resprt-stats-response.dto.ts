import { ApiProperty } from '@nestjs/swagger';
import { ReportStatsData } from './data/report-stats.data';
import { CommonResponseDto } from './common/common-response.dto';
import { ICommonResponse } from './interface/common.if';

export class ReportStatsResponseDto extends CommonResponseDto implements ICommonResponse<ReportStatsData> {
    @ApiProperty({
        description: '統計資料',
        type: ReportStatsData,
    })
    data?: ReportStatsData;
}