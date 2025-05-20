import { IsOptional, IsString, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModifiedByData } from '../data/modified-by.data';
import { MEMBER_LEVEL } from '../../utils/enum';
import { MemberBaseDataDto } from './member-base-data.dto';

export class MemberData extends MemberBaseDataDto  {

  @ApiProperty({
    description: '系統編號（如：國興編號）',
    required: false,
    example: '1101',
  })
  @IsOptional()
  @IsString()
  systemId?: string;

  @ApiProperty({
    description: '電子郵件位址',
    required: false,
    example: 'example@email.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: '電話',
    required: false,
    example: '0933123456'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '地址',
    required: false,
    example: '',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: '會員型式最後異動人員',
    required: false,
    type: ModifiedByData,
  })
  @IsObject()
  membershipLastModified?: ModifiedByData = new ModifiedByData();

  @ApiProperty({
    description: '加入日期',
    required: false,
    example: '2025-01-01',
  })
  @IsOptional()
  @IsString()
  joinDate?: string;

  @ApiProperty({
    description: '到期日',
    required: false,
    example: '2025-01-01',
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    description: '註記',
    required: false,
    example: '',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: '上次登入時間',
    required: false,
    example: '2025-01-01 17:01:01',
  })
  @IsOptional()
  @IsString()
  lastLogin?: number;

  @ApiProperty({
    description: '上次登入IP',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastLoginIp?: string;

  @ApiProperty({
    description: '非股東會員董監代表之股東代號',
    required: false,
    example: '1001'
  })
  @IsOptional()
  @IsString()
  refSystemId: string;

  @ApiProperty({
    description: '確認人員及時間',
    required: false,
    type: ModifiedByData,
  })
  @IsOptional()
  @IsObject()
  directorStatusLastModified?: ModifiedByData = new ModifiedByData();

      @ApiProperty({
        description: '會員型式',
        required: false,
        enum: MEMBER_LEVEL,
        example: MEMBER_LEVEL.GENERAL_MEMBER,
    })
    @IsOptional()
    @IsString()
    membershipType?: MEMBER_LEVEL;

    @ApiProperty({
        description: '董監事註記',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isDirector?: boolean;

}
