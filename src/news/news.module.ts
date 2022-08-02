import { Module } from '@nestjs/common';
import {
  NewsCategoryService,
  NewsService,
  UserLikesNewsService,
} from './news.service';
import {
  NewsCategoryResolver,
  NewsResolver,
  UserLikesNewsResolver,
} from './news.resolver';
import { Upload } from 'src/common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  NewsImage,
  UserLikesNews,
} from './entities/news.entity';
import { NewsTaggit } from 'src/tags/entities/tag.entity';

@Module({
  providers: [
    NewsResolver,
    NewsService,
    Upload,
    NewsCategoryResolver,
    NewsCategoryService,
    UserLikesNewsResolver,
    UserLikesNewsService,
  ],
  imports: [
    TypeOrmModule.forFeature([News, NewsImage, NewsCategory, UserLikesNews, NewsTaggit]),
  ],
  exports: [
    TypeOrmModule.forFeature([News]),
  ]
})
export class NewsModule {}
