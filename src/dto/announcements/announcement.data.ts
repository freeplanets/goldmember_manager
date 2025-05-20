import { IsOptional, IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement } from '../interface/announcement.if';
import { MEMBER_GROUP } from '../../utils/enum';
import { Attachment } from './attachment';
import { ModifiedByData } from '../data/modified-by.data';
import { AnnouncementCreateDto } from './announcement-create.dto';
import { AnnouncementBaseDto } from './announcement-base.dto';
import { IModifiedBy } from '../interface/modifyed-by.if';

export class AnnouncementData extends AnnouncementBaseDto implements Partial<IAnnouncement> {

  @ApiProperty({
    description: '新增者',
    required: false,
  })
  creator: IModifiedBy;

  @ApiProperty({
    description: '修改者',
    required: false,
  })
  updater: IModifiedBy;

  @ApiProperty({
    description: '核准人',
    required: false,
  })
  apprevor: IModifiedBy;
}
