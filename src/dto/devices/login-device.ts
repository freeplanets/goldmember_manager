import { ApiProperty } from "@nestjs/swagger";
import { ILoginDevice } from "../interface/devices.if";

export class LoginDevice implements ILoginDevice {
    @ApiProperty({
        description: '設備類別 (ios/android/web)',
    })
    deviceType: string;

    @ApiProperty({
        description: '設備品牌',
    })
    deivceBrand: string;

    @ApiProperty({
        description: '設備機型名稱',
    })
    deviceModel: string;

    @ApiProperty({
        description: '設備名稱',
    })
    deviceName: string;

    @ApiProperty({
        description: '設備編號',
    })
    deviceId: string;

    @ApiProperty({
        description: '系統名稱',
    })
    systemName: string;

    @ApiProperty({
        description: '系統版本',
    })
    systemVersion: string;

    @ApiProperty({
        description: '最後登入ip',
    })
    lastLoginIp?: string;

    @ApiProperty({
        description: '最後登入時間',
    })
    lastLogin: number;
}