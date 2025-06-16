import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncement } from "../interface/announcement.if";

export class AnnouncePublishRequest implements Partial<IAnnouncement> {
    @ApiProperty({
        description: '是否核准公告',
        type: Boolean,
        required: false,
    })
    isPublished?: boolean;
}