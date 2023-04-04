import { ObjectType } from '@nestjs/graphql';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { Notification } from '@app/shared/entities/notifications.entity';

@ObjectType()
export default class NotificationResponse extends relayTypes<Notification>(
  Notification,
) {}
