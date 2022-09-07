import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateNotificationDeviceInput, NotificationInput, NotificationNewsInput } from "./dto/create-notification.input";
import { Notification, NotificationDevice } from "./entities/notifications.entity";
import { NotificationsService } from "./notifications.service";


@Resolver(() => NotificationDevice)
export class NotificationsResolver {
    constructor(
        private readonly notificationsService: NotificationsService,
    ) {}

    @Mutation(() => NotificationDevice)
    async createNotificationDevice(
        @Args('CreateNotificationDeviceInput') createNotificationDeviceInput: CreateNotificationDeviceInput,
    ) {
        return await this.notificationsService.create(createNotificationDeviceInput);
    }

    @Mutation(() => Notification)
    async sendNotification(
        @Args('notificationInput') notificationInput: NotificationInput,
    ) {
        return await this.notificationsService.sendNotification(notificationInput);
    }

    @Mutation(() => Notification)
    async sendNotificationNews(
        @Args('notificationNewsInput') notificationNewsInput: NotificationNewsInput,
    ) {
        return await this.notificationsService.sendNotificationNews(notificationNewsInput);
    }
}