import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateNotificationDeviceInput {
  @Field({ description: 'Notification device token' })
  token: string;

  @Field(() => Int, { description: 'Notification device user', nullable: true })
  userId?: number;

  @Field({ description: 'Notification device platform' })
  platform: string;
}

@InputType()
export class NotificationInput {
  @Field({ description: 'Notification title' })
  title: string;

  @Field({ description: 'Notification body' })
  body: string;

  @Field({ description: 'Notification image', nullable: true })
  image?: string;

  @Field({ description: 'Notification data', nullable: true })
  data?: string;
}

@InputType()
export class NotificationNewsInput {
  @Field(() => Int, { description: 'News Id' })
  newsId: number;
}
