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
  ],
})
export class CommentsModule {}
