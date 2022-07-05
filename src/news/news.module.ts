import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { Upload } from 'src/common/scalars/upload.scalar';

@Module({
  providers: [NewsResolver, NewsService, Upload],
})
export class NewsModule {}
