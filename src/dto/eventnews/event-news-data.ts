import { ApiProperty } from "@nestjs/swagger";
import { IEventNews } from "../interface/event-news";
import { EventNewsCreateReqDto } from "./event-news-create-request.dto";

export class EventNewsData extends EventNewsCreateReqDto implements Partial<IEventNews> {
    @ApiProperty({
        description: '賽事訊息代號',
    })
    id: string;
}