import { SharedModule } from '@app/shared';
import { News } from '@app/shared/entities/news.entity';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewscacheController } from './newscache.controller';
import { NewscacheService } from './newscache.service';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

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
  ],
  controllers: [NewscacheController],
  providers: [NewscacheService],
})
export class NewscacheModule {}
