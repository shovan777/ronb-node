import { Module } from '@nestjs/common';
import {
  NewsCommentsService,
  NewsRepliesService,
  PermissionService,
  UserLikesNewsCommentService,
  UserLikesNewsReplyService,
  UsersService,
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
} from './entities/comment.entity';
import { NewsModule } from 'src/news/news.module';
import {
  NewsReplySubscriber,
  UserLikesNewsCommentSubscriber,
  UserLikesNewsReplySubscriber,
} from './comments.subscriber';
import { NotificationsModule } from 'src/notifications/notifications.module';

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
    UsersService,
    PermissionService,
    NewsReplySubscriber,
    UserLikesNewsCommentSubscriber,
    UserLikesNewsReplySubscriber,
  ],
})
export class CommentsModule {}
