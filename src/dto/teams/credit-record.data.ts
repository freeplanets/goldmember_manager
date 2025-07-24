import { ApiProperty } from "@nestjs/swagger";
import { ICreditRecord } from "../interface/team-group.if";
import { ModifiedByData } from "../data/modified-by.data";
import { IModifiedBy } from "../interface/modifyed-by.if";

export class CreditRecordData implements Partial<ICreditRecord> {
    @ApiProperty({
        description: '日期',
    })
    date?: string;

    @ApiProperty({
        description: '分數',
    })
    score?: number;

    @ApiProperty({
        description: '理由',
    })
    reason?: string;

    @ApiProperty({
        description: '評分人口月員',
        type: ModifiedByData,
    })
    recordedBy?: IModifiedBy;
}