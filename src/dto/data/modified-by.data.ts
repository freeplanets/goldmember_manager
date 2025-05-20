import { ApiProperty } from '@nestjs/swagger';
import { IModifiedBy } from '../interface/modifyed-by.if';

export class ModifiedByData implements IModifiedBy {
  @ApiProperty({
    description: '修改人員編號',
    required: false,
  })
  modifiedBy?: string;

  @ApiProperty({
    description: '修改人員名稱',
    required: false,
  })
  modifiedByWho: string;

  @ApiProperty({
    description: '修改時間(timestamp)',
    required: false,
  })
  modifiedAt?: number;

  @ApiProperty({
    description: '修改前數值',
    required: false,
  })
  lastValue: string | number | boolean;
}
