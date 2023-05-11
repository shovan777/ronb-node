import {
  GetNewsRecommendationResponse,
  NEWS_RECOMMENDATION_SERVICE_NAME,
  NewsRecommendationServiceClient,
} from '@app/shared/common/proto/recommendation.pb';
import { News } from '@app/shared/entities/news.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { In, Repository } from 'typeorm';

@Injectable()
export class NewscacheService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject('REDIS_CLIENT')
    private redisCache: RedisClientType,
  ) {}
  async getHello(): Promise<News[]> {
    console.log('***********getHello');
    const newsCache: News[] = await this.cacheManager.get('news');
    console.log(`newsCache: ${newsCache}`);
    return newsCache;
  }

  async findNewsNCache(newsIds: number[], userId: number): Promise<News[]> {
    const newsToCache: News[] = await this.newsRepository.find({
      where: { id: In(newsIds) },
    });
    this.cacheManager.set(`newscache_${userId}`, newsToCache);
    // console.log(`setting in cache: ${twoNews.map((n) => n.id)}`);
    // append news to tail of user's cache if exists
    // else creates
    // await this.redisCache.rPush(
    //   `newscache_${userId}`,
    //   JSON.stringify(newsToCache),
    // );
    // await this.cacheManager.set(`newscache_${userId}`, newsToCache);
    return newsToCache;
  }
}

@Injectable()
export class NewsRecommendationClientService implements OnModuleInit {
  private newsRecommendationService: NewsRecommendationServiceClient;
  constructor(
    @Inject(NEWS_RECOMMENDATION_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.newsRecommendationService =
      this.client.getService<NewsRecommendationServiceClient>(
        NEWS_RECOMMENDATION_SERVICE_NAME,
      );
  }

  async getNewsRecommendation(): Promise<
    Observable<GetNewsRecommendationResponse>
  > {
    // const newsArr = [];
    return this.newsRecommendationService.getNewsRecommendation({ userId: 12 });
    //   .subscribe({
    //     next: (response) => {
    //       console.log(`response: ${response.newsIds}`);
    //       // news = this.newscacheService.findNews(response.newsIds);
    //     },
    //   });
    // return newsArr;
  }
}
