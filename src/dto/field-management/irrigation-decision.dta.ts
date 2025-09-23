import { ApiProperty } from "@nestjs/swagger";
import { IIrrigationDecisions } from "../interface/field-management.if";
import { IrrigationDecisionReqDto } from "./irrigation-decision-request.dto";

export class IrrigationDecisionDta extends IrrigationDecisionReqDto implements Partial<IIrrigationDecisions> {
    @ApiProperty({
        description: '記錄唯一識別碼',
    })
    id?: string;

    @ApiProperty({
        description: '記錄人員',
    })
    recordedBy?: string;

    @ApiProperty({
        description: '記錄時間',
    })
    recordedAt?: string;

    @ApiProperty({
        description: '時間戳',
    })
    recordedAtTS?: number;
}