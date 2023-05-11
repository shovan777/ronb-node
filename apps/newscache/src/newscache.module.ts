import { SharedModule } from '@app/shared';
import { News } from '@app/shared/entities/news.entity';
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

@Module({
  imports: [
    ConfigModule.forRoot({}),
    // AppModule,
    SharedModule,
    TypeOrmModule.forFeature([News]),
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
          url: 'localhost:50052',
          package: RECOMMENDATION_PACKAGE_NAME,
          protoPath: join(
            process.cwd(),
            'dist/libs/shared/common/proto/recommendation.proto',
          ),
        },
      },
    ]),
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
