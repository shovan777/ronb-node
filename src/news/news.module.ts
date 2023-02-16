import { forwardRef, Module } from '@nestjs/common';
import {
  NewsCategoryService,
  NewsService,
  RecommendationDataService,
  UserInterestsService,
  UserLikesNewsService,
} from './news.service';
import {
  NewsCategoryResolver,
  NewsResolver,
  RecommendationDataResolver,
  UserInterestsResolver,
  UserLikesNewsResolver,
} from './news.resolver';
import { Upload } from 'src/common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  NewsImage,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
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
    UserInterestsResolver,
    UserInterestsService,
    RecommendationDataResolver,
    RecommendationDataService,
  ],
  imports: [
    forwardRef(() => TagsModule),
    TypeOrmModule.forFeature([
      News,
      NewsImage,
      NewsCategory,
      UserLikesNews,
      UserNewsEngagement,
      UserInterests,
    ]),
  ],
  exports: [NewsService],
})
export class NewsModule {}
