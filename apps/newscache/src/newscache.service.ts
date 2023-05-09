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
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class NewscacheService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async getHello(): Promise<News[]> {
    console.log('***********getHello');
    const newsCache: News[] = await this.cacheManager.get('news');
    console.log(`newsCache: ${newsCache}`);
    return newsCache;
  }

  async findNews(): Promise<News[]> {
    const twoNews: News[] = await this.newsRepository.find({ take: 2 });
    console.log(`setting in cache: ${twoNews.map((n) => n.id)}`);
    await this.cacheManager.set('news', twoNews);
    return twoNews;
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
    return this.newsRecommendationService.getNewsRecommendation({ userId: 12 });
  }
}
