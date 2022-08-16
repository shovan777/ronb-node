import { Module } from '@nestjs/common';
import {
  NewsCommentsService,
  NewsRepliesService,
  UserLikesNewsCommentService,
} from './comments.service';
import {
  NewsCommentsResolver,
  NewsRepliesResolver,
  UserLikesNewsCommentResolver,
} from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
} from './entities/comment.entity';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsComment, NewsReply, UserLikesNewsComment]),
    NewsModule,
  ],
  providers: [
    NewsCommentsResolver,
    NewsCommentsService,
    NewsRepliesResolver,
    NewsRepliesService,
    UserLikesNewsCommentService,
    UserLikesNewsCommentResolver,
  ],
})
export class CommentsModule {}
