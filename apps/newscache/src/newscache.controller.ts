import {
  BeginCachingResponse,
  NEWS_CACHING_SERVICE_NAME,
  UserId,
} from '@app/shared/common/proto/news.pb';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  NewsRecommendationClientService,
  NewscacheService,
} from './newscache.service';
import { News } from '@app/shared/entities/news.entity';
import { firstValueFrom, timeout } from 'rxjs';

@Controller()
export class NewscacheController {
  constructor(
    private readonly newscacheService: NewscacheService,
    private readonly newsRecommendationClientService: NewsRecommendationClientService,
  ) {}

  @Get()
  getHello(): Promise<any> {
    return this.newscacheService.getHello();
  }

  // @Get('news')
  // getNews() {
  //   const news_arr = this.newscacheService.findNews();
  //   console.log(news_arr);
  //   return this.newscacheService.findNews();
  // }

  @GrpcMethod(NEWS_CACHING_SERVICE_NAME, 'BeginCaching')
  async beginCaching(userData: UserId): Promise<BeginCachingResponse> {
    console.log(`Begin Caching request received ${userData.id}`);
    firstValueFrom(
      await this.newsRecommendationClientService.getNewsRecommendation(
        userData.id,
      ),
    ).then((newsData) => {
      console.log(newsData);
      this.newscacheService
        .findNewsNCache(newsData.newsIds, userData.id)
        .then((newsCache) => {
          console.log(`newsCache: ${newsCache.map((n) => n.id)}`);
        });
    });
    // (
    //   await this.newsRecommendationClientService.getNewsRecommendation()
    // ).subscribe({
    //   next: (response) => {
    //     console.log(`response: ${response.newsIds}`);
    //     const news = this.newscacheService.findNewsNCache(
    //       response.newsIds,
    //       data.id,
    //     );
    //     news.then((res) => {
    //       console.log(`news: ${res.map((n) => n.id)}`);
    //     });
    //   },
    // });
    // news.then((res) => {
    //   console.log(`news: ${res}`);
    // });
    // this.newsRecommendationClientService.getNewsRecommendation().then((res) => {
    //   console.log('Data received');
    // });
    // this.newscacheService.findNews();
    return { success: true };
  }
}
