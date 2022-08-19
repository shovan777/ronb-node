import { Module } from '@nestjs/common';
import {
  NewsCommentsService,
  NewsRepliesService,
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
  ],
})
export class CommentsModule {}
