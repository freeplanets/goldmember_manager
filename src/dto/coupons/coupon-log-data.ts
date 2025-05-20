import { ApiProperty } from "@nestjs/swagger";
import { CouponAutoIssueLogReqDto } from "./coupon-auto-issue-log-request.dto";

export class CouponLogData extends CouponAutoIssueLogReqDto {
    @ApiProperty({
        description: '發行日期'
    })
    issueDate?: string;

    @ApiProperty({
        description: '原始批次代號',
    })
    originBatchId?: string;

    @ApiProperty({
        description: '當次發行張數',
    })
    totalCoupons?: number;

    @ApiProperty({
        description: '執行時時間戳',
    })
    issueDateTs?: number;    
}