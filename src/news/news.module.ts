import { Module } from '@nestjs/common';
import { NewsCategoryService, NewsService } from './news.service';
import { NewsCategoryResolver, NewsResolver } from './news.resolver';
import { Upload } from 'src/common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News, NewsCategory, NewsImage } from './entities/news.entity';

@Module({
  providers: [
    NewsResolver,
    NewsService,
    Upload,
    NewsCategoryResolver,
    NewsCategoryService,
  ],
  imports: [TypeOrmModule.forFeature([News, NewsImage, NewsCategory])],
})
export class NewsModule {}
