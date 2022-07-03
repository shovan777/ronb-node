import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';

@Module({
  providers: [NewsResolver, NewsService]
})
export class NewsModule {}
