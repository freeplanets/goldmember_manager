import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../interface/user.if";

export class UserStatusDto implements Partial<IUser> {
    @ApiProperty({
        description: '是否啟用',
        example: true,
    })
    isActive: boolean;
}