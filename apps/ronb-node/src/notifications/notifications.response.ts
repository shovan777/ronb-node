import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../common/pagination/types/relay.types';
import { Notification } from './entities/notifications.entity';

@ObjectType()
export default class NotificationResponse extends relayTypes<Notification>(Notification) {}
