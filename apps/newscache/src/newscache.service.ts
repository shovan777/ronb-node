import {
  GetNewsRecommendationResponse,
  NEWS_RECOMMENDATION_SERVICE_NAME,
  NewsRecommendationServiceClient,
} from '@app/shared/common/proto/recommendation.pb';
import { NewsComment } from '@app/shared/entities/comment.entity';
import {
  News,
  NewsCategory,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { Tag } from '@app/shared/entities/tags.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { createObjectCsvWriter } from 'csv-writer';
import { RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { DataSource, In, Repository } from 'typeorm';
import { RecommendationData } from './interfaces/recommendations.interface';
import { join } from 'path';
import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';

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

  // get 10 news from db
  private async getNewsFromDB(sliceOfIds: number[]): Promise<News[]> {
    const sqlQuery = this.newsRepository.query(
      `select n.* from unnest('{${sliceOfIds.join(
        ',',
      )}}'::int[]) with ordinality as t(id, ord) join news n using(id) order by t.ord`,
    );
    // https://dba.stackexchange.com/questions/243675/order-of-where-in-result-for-postgresql
    // .createQueryBuilder('news')
    // .whereInIds(sliceOfIds)
    // .orderBy(`FIELD(news.id, ${sliceOfIds.join(',')})`);
    return await sqlQuery;
    // return await this.newsRepository.find({
    //   where: { id: In(sliceOfIds) },
    //   // sort by order in sliceofIds
    //   // order: { id: sliceOfIds },
    // });
  }

  async findNewsNCache(newsIds: number[], userId: number): Promise<News[]> {
    let newsToCache: News[] = [];
    // avoid to many calls to db or redis
    // divide newsIds into slices of 10
    const newsIdsCount = newsIds.length;
    const numTraversal = Math.floor(newsIdsCount / 10);
    const remainder = newsIdsCount % 10;

    // push to cache array in chunks of 10
    for (let i = 0; i < numTraversal; i++) {
      const sliceOfIds = newsIds.slice(i * 10, (i + 1) * 10);
      const news = await this.getNewsFromDB(sliceOfIds);
      console.log(`news from db${i}th slice: ${news.map((n) => n.id)}`);
      newsToCache = newsToCache.concat(news);
      await this.redisCache.rPush(`newscache_${userId}`, JSON.stringify(news));
    }
    if (remainder > 0) {
      const sliceOfIds = newsIds.slice(numTraversal * 10);
      const news = await this.getNewsFromDB(sliceOfIds);
      newsToCache = newsToCache.concat(news);
    }

    // this.cacheManager.set(`newscache_${userId}`, newsToCache);
    // console.log(`setting in cache: ${twoNews.map((n) => n.id)}`);
    // append news to tail of user's cache if exists
    // else creates
    // for (const id of newsIds) {
    //   await this.redisCache.rPush(`newscache_${userId}`, id.toString());
    // }
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

  async getNewsRecommendation(
    userId: number,
  ): Promise<Observable<GetNewsRecommendationResponse>> {
    // const newsArr = [];
    return this.newsRecommendationService.getNewsRecommendation({
      userId: userId,
    });
    //   .subscribe({
    //     next: (response) => {
    //       console.log(`response: ${response.newsIds}`);
    //       // news = this.newscacheService.findNews(response.newsIds);
    //     },
    //   });
    // return newsArr;
  }
}
