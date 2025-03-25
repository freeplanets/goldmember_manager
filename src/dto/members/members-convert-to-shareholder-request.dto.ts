import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMember } from '../interface/member.if';
import { MEMBER_LEVEL } from '../../utils/enum';

export class MembersConvertToShareholderRequestDto implements Partial<IMember> {
  @ApiProperty({
    description: '會員代號'
  })
  @IsString()
  id?: string;

  @ApiProperty({
    description: '會員種類',
    required: false,
    enum: MEMBER_LEVEL,
    example: MEMBER_LEVEL.SHARE_HOLDER,
  })
  @IsOptional()
  @IsString()
  membershipType?: MEMBER_LEVEL;

  @ApiProperty({
    description: '國興代號',
    required: false,
    example: '1001',
  })
  @IsOptional()
  @IsString()
  systemId?: string;
}
