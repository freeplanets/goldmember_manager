import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { INotificationOptions } from "../interface/member.if";


@Schema()
export class NotificationOptions implements INotificationOptions {
    @Prop({
        default: true,
    })
    announcements: boolean;

    @Prop({
        default: true,
    })
    bookingReminders: boolean;

    @Prop({
        default: true,
    })
    teamInvites: boolean;

    @Prop({
        default: true,
    })
    systemNotifications: boolean;

    @Prop({
        default: true,
    })
    couponNotifications: boolean;    
}

export const NotificationOptionsSchema = SchemaFactory.createForClass(NotificationOptions);