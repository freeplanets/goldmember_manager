import { ApiProperty } from "@nestjs/swagger";
import { IAnnouncementSearch, IGroupsSearch } from "../interface/announcement.if";
import { GroupSearch } from "./group-search.dto";
import { IsObject, IsString } from "class-validator";

export class AnnouncementSearch implements IAnnouncementSearch {
    @ApiProperty({
        description: '公告類型',
        required: false,
    })
    @IsString()
    type?: string;

    @ApiProperty({
        description: '群組查詢組合',
        type: GroupSearch,
        required: false,
    })
    @IsObject()
    groups: IGroupsSearch;
}