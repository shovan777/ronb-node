import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  NewsImage,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from './entities/news.entity';
import {
  Notification,
  NotificationDevice,
} from './entities/notifications.entity';
import {
  PublicToilet,
  PublicToiletImage,
} from './entities/public-toilet.entity';
import { PublicToiletReview } from './entities/reviews.entity';
import { NewsTaggit, Tag } from './entities/tags.entity';
import {
  District,
  Province,
  YellowPages,
  YellowPagesAddress,
  YellowPagesCatgory,
  YellowPagesEmail,
  YellowPagesPhoneNumber,
} from './entities/yellow-pages.entity';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from './entities/comment.entity';
import {
  BloodRequest,
  BloodRequestAddress,
} from './entities/blood-bank.entity';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [
    // NewsSharedModule,
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true',
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      News,
      NewsImage,
      NewsCategory,
      UserLikesNews,
      UserNewsEngagement,
      UserInterests,
      NewsComment,
      NewsReply,
      UserLikesNewsComment,
      UserLikesNewsReply,
      Notification,
      NotificationDevice,
      PublicToilet,
      PublicToiletImage,
      PublicToiletReview,
      Tag,
      NewsTaggit,
      YellowPages,
      YellowPagesCatgory,
      YellowPagesAddress,
      District,
      Province,
      YellowPagesPhoneNumber,
      YellowPagesEmail,
      BloodRequest,
      BloodRequestAddress,
    ]),
  ],
})
export class SharedModule {}
