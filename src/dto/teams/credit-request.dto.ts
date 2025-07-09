import { ApiProperty } from '@nestjs/swagger';
import { ICreditRecord } from '../interface/team-group.if';
import { IsNumber, IsString } from 'class-validator';

export class CreditRequestDto implements Partial<ICreditRecord> {
    @ApiProperty({
        description: '評分', 
        example: 5,
        required: true,
    })
    @IsNumber()
    score: number; //評分

    @ApiProperty({
        description: '原因', 
        example: '準時到場',
        required: true,
    })
    @IsString()
    reason: string; //原因
}
    
    