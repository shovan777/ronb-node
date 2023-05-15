import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateNotificationDeviceInput,
  NotificationInput,
  NotificationNewsInput,
} from './dto/create-notification.input';
import {
  Notification,
  NotificationDevice,
} from '@app/shared/entities/notifications.entity';
import { NotificationsService } from './notifications.service';
import { User } from '@app/shared/common/decorators/user.decorator';
import ConnectionArgs from '@app/shared/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { checkUserAuthenticated } from '@app/shared/common/utils/checkUserAuthentication';
import NotificationResponse from './notifications.response';

@Resolver(() => NotificationDevice)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Mutation
  // to create Notification device
  @Mutation(() => NotificationDevice)
  async createNotificationDevice(
    @Args('CreateNotificationDeviceInput')
    createNotificationDeviceInput: CreateNotificationDeviceInput,
    @User() user: number,
  ) {
    return await this.notificationsService.create(
      createNotificationDeviceInput,
      user,
    );
  }

  // send notification to whole devices
  @Mutation(() => Notification)
  async sendNotification(
    @Args('notificationInput') notificationInput: NotificationInput,
  ) {
    const dataObject = {
      category: 'urgent',
    };
    notificationInput.data = JSON.stringify(dataObject);
    return await this.notificationsService.sendNotification(notificationInput);
  }

  // send notification of news to whole devices
  @Mutation(() => Notification)
  async sendNotificationNews(
    @Args('notificationNewsInput') notificationNewsInput: NotificationNewsInput,
  ) {
    return await this.notificationsService.sendNotificationNews(
      notificationNewsInput,
    );
  }

  // Query
  // Query notification
  @Query(() => NotificationResponse, { name: 'notificationUser' })
  async findNotificationsUser(
    @Args() args: ConnectionArgs,
    @User() user: number,
  ): Promise<NotificationResponse> {
    checkUserAuthenticated(user);
    const { limit, offset } = args.pagingParams();
    const [notifications, count] =
      await this.notificationsService.findNotificationsUser(
        limit,
        offset,
        user,
      );
    const page = connectionFromArraySlice(notifications, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return {
      page,
      pageData: {
        count,
        limit,
        offset,
        curTime: new Date(),
      },
    };
  }

  // Query notification all
  @Query(() => NotificationResponse, { name: 'notificationAll' })
  async findNotification(
    @Args() args: ConnectionArgs,
    @User() user: number,
  ): Promise<NotificationResponse> {
    const { limit, offset } = args.pagingParams();
    const [notifications, count] =
      await this.notificationsService.findNotifications(limit, offset, user);
    const page = connectionFromArraySlice(notifications, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return {
      page,
      pageData: {
        count,
        limit,
        offset,
      },
    };
  }
}
