import { Module } from '@nestjs/common';
import {
  NewsCommentsService,
  NewsRepliesService,
  UserLikesNewsCommentService,
  UserLikesNewsReplyService,
} from './comments.service';
import {
  NewsCommentsResolver,
  NewsRepliesResolver,
  UserLikesNewsCommentResolver,
  UserLikesNewsReplyResolver,
} from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from '@app/shared/entities/comment.entity';
import { NewsModule } from '../news/news.module';
import {
  NewsReplySubscriber,
  UserLikesNewsCommentSubscriber,
  UserLikesNewsReplySubscriber,
} from './comments.subscriber';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsComment,
      NewsReply,
      UserLikesNewsComment,
      UserLikesNewsReply,
    ]),
    // TypeOrmModule.forFeature('usersConnection'),
    NewsModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [
    NewsCommentsResolver,
    NewsCommentsService,
    NewsRepliesResolver,
    NewsRepliesService,
    UserLikesNewsCommentService,
    UserLikesNewsCommentResolver,
    UserLikesNewsReplyResolver,
    UserLikesNewsReplyService,
    NewsReplySubscriber,
    UserLikesNewsCommentSubscriber,
    UserLikesNewsReplySubscriber,
  ],
})
export class CommentsModule {}