import { ApiProperty } from "@nestjs/swagger";
import { IGreenSpeeds } from "../interface/field-management.if";

export class GreenSpeedDta implements Partial<IGreenSpeeds> {
    @ApiProperty({
        description: '記錄唯一識別碼',
    })
    id?: string;
    
    @ApiProperty({
        description: '記錄日期 (YYYY/MM/DD)',
    })
    date?: string;

    @ApiProperty({
        description: '西區果嶺速度',
    })
    westSpeed?: number;
    
    @ApiProperty({
        description: '南區果嶺速度',
    })
    southSpeed?: number;

    @ApiProperty({
        description: '東區果嶺速度',
    })
    eastSpeed?: number;

    @ApiProperty({
        description: '註記',
    })
    notes?: string;

    @ApiProperty({
        description: '記錄人員',
    })
    recordedBy?: string;

    @ApiProperty({
        description: '記錄時間',
    })
    recordedAt?: string;
}