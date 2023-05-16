import { forwardRef, Module } from '@nestjs/common';
import {
  NewsCacheClientService,
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
import { Upload } from '@app/shared/common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  NewsImage,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { TagsModule } from '../tags/tags.module';
import { FilesService } from '@app/shared/common/services/files.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  NEWS_CACHING_SERVICE_NAME,
  NEWS_PACKAGE_NAME,
} from '@app/shared/common/proto/news.pb';

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
    NewsCacheClientService,
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
    ClientsModule.register([
      {
        name: NEWS_CACHING_SERVICE_NAME,
        // name: 'NEWS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: NEWS_PACKAGE_NAME,
          protoPath: join(
            process.cwd(),
            'dist/libs/shared/common/proto/news.proto',
          ),
        },
      },
    ]),
  ],
  exports: [NewsService],
})
export class NewsModule {}
