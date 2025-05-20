import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeviceRefreshTokenDto {
    @ApiProperty({
        description:'device refresh token',
    })
    @IsString()
    deviceid: string;
}