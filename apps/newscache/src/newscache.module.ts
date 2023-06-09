import { SharedModule } from '@app/shared';
import {
  News,
  NewsCategory,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewscacheController } from './newscache.controller';
import {
  NewsRecommendationClientService,
  NewscacheService,
} from './newscache.service';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions, createClient } from 'redis';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RECOMMENDATION_PACKAGE_NAME } from '@app/shared/common/proto/recommendation.pb';
import { NEWS_RECOMMENDATION_SERVICE_NAME } from '@app/shared/common/proto/recommendation.pb';
import { join } from 'path';
import { NewsComment } from '@app/shared/entities/comment.entity';
import { Tag } from '@app/shared/entities/tags.entity';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    // AppModule,
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
    CacheModule.register<RedisClientOptions>({
      ttl: 60 * 60 * 24 * 7, // 7 days
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () =>
        await redisStore({
          url: process.env.REDIS_URL,
        }),
    }),
    // TODO: add client module to recommender here
    ClientsModule.register([
      {
        name: NEWS_RECOMMENDATION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.REC_SVC}:50052`,
          package: RECOMMENDATION_PACKAGE_NAME,
          protoPath: join(
            process.cwd(),
            'dist/libs/shared/common/proto/recommendation.proto',
          ),
        },
      },
    ]),
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
  controllers: [NewscacheController],
  providers: [
    NewscacheService,
    NewsRecommendationClientService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = createClient({
          url: `${process.env.REDIS_URL}/0`,
        });
        client.connect().then(() => {
          console.log('**********news cache redis connected');
        });
        return client;
      },
    },
  ],
})
export class NewscacheModule {}
