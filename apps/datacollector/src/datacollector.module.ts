import { Module } from '@nestjs/common';
import { DatacollectorController } from './datacollector.controller';
import { DatacollectorService } from './datacollector.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  News,
  NewsCategory,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { NewsComment } from '@app/shared/entities/comment.entity';
import { Tag } from '@app/shared/entities/tags.entity';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    SharedModule,
    TypeOrmModule.forFeature([
      News,
      NewsCategory,
      UserLikesNews,
      UserNewsEngagement,
      NewsComment,
      Tag,
      UserInterests,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot(
      (() => {
        if (process.env.DJANGO_DB_TYPE === 'postgres') {
          return {
            type: 'postgres',
            host: process.env.DJANGO_DB_HOST,
            port: +process.env.DJANGO_DB_PORT,
            username: process.env.DJANGO_DB_USER,
            password: process.env.DJANGO_DB_PASSWORD,
            database: process.env.DJANGO_DB_NAME,
            synchronize: false,
            autoLoadEntities: false,
            name: 'usersConnection',
          };
        }
        return {
          type: 'sqlite',
          database:
            '/home/calcgen2/prokura_workspace/ronb_ws/ronb-django/db.sqlite3',
          name: 'usersConnection',
        };
      })(),
    ),
  ],
  controllers: [DatacollectorController],
  providers: [DatacollectorService],
})
export class DatacollectorModule {}
