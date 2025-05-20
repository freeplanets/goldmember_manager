import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../interface/user.if";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { LEVEL } from "../../utils/enum";

export class UserBaseDataDto implements Partial<IUser> {
  @ApiProperty({
    description: '使用者顯示名稱',
    required: false,
    example: 'jj',
  })

  @IsOptional()
  @IsString()
  displayName?: string;
  @ApiProperty({
    description: '職稱',
    required: false,
    example: '管理人員'
  })
  @IsOptional()
  @IsString()
  role?: string;
  
  @ApiProperty({
    description: '安全層級',
    required: false,
    enum: LEVEL,
    example: LEVEL.MANAGER,
  })
  @IsOptional()
  @IsString()
  authRole?: LEVEL;
}