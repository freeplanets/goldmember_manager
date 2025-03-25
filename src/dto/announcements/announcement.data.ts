import { IsOptional, IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAnnouncement } from '../interface/announcement.if';
import { ANNOUNCEMENT_GROUP } from '../../utils/enum';
import { Attachment } from './attachment';
import { ModifiedByData } from '../data/modified-by.data';
import { AnnouncementCreateDto } from './announcement-create.dto';

export class AnnouncementData extends AnnouncementCreateDto {

  @ApiProperty({
    description: '新增者',
    required: false,
  })
  creator: ModifiedByData;

  @ApiProperty({
    description: '修改者',
    required: false,
  })
  updater: ModifiedByData;

  @ApiProperty({
    description: '核准人',
    required: false,
  })
  apprevor: ModifiedByData;
}
