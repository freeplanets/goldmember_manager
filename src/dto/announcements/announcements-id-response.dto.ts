
import { ApiProperty } from "@nestjs/swagger";
import { CommonResponseDto } from "../common/common-response.dto";
import { ICommonResponse } from "../interface/common.if";
import { AnnouncementData } from "./announcement.data";

export class AnnouncementsIdResponseDto extends CommonResponseDto implements ICommonResponse<AnnouncementData> {
  @ApiProperty({
    description: '公告內容',
    type: AnnouncementData
  })
  data?: AnnouncementData;
}
