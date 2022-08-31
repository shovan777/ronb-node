import { forwardRef, Module } from '@nestjs/common';
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
import { TagsModule } from 'src/tags/tags.module';
import { FilesService } from 'src/common/services/files.service';

@Module({
  providers: [
    NewsResolver,
    NewsService,
    Upload,
    NewsCategoryResolver,
    NewsCategoryService,
    UserLikesNewsResolver,
    UserLikesNewsService,
    FilesService,
  ],
  imports: [
    forwardRef(() => TagsModule),
    TypeOrmModule.forFeature([News, NewsImage, NewsCategory, UserLikesNews]),
  ],
  exports: [NewsService],
})
export class NewsModule {}
