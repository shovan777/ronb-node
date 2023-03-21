import { forwardRef, Module } from '@nestjs/common';
import {
  NewsCategoryService,
  NewsEngagementService,
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
  UserNewsEngagementResolver,
} from './news.resolver';
import { Upload } from '../common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  NewsImage,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from './entities/news.entity';
import { TagsModule } from '../tags/tags.module';
import { FilesService } from '../common/services/files.service';

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
    UserNewsEngagementResolver,
    NewsEngagementService,
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
