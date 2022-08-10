import { Module } from '@nestjs/common';
import { NewsCommentsService, NewsRepliesService } from './comments.service';
import { NewsCommentsResolver, NewsRepliesResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsComment, NewsReply } from './entities/comment.entity';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [TypeOrmModule.forFeature([NewsComment, NewsReply]), NewsModule],
  providers: [
    NewsCommentsResolver,
    NewsCommentsService,
    NewsRepliesResolver,
    NewsRepliesService,
  ],
})
export class CommentsModule {}
