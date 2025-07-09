import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { INofication } from '../../utils/settings/settings.if';

export class NoficationDto implements INofication {
    @ApiProperty({
        description: '取消預約通知前的最小小時數',
        required: false,
        example: '24'
    })
    @IsOptional()
    @IsString()
    notification_hours: string;
}