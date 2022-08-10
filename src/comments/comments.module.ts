import { Module } from '@nestjs/common';
import { NewsCommentsService } from './comments.service';
import { NewsCommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsComment, NewsReply } from './entities/comment.entity';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [TypeOrmModule.forFeature([NewsComment, NewsReply]), NewsModule],
  providers: [NewsCommentsResolver, NewsCommentsService],
})
export class CommentsModule {}
