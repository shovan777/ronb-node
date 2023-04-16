import {
  BeginCachingResponse,
  NEWS_CACHING_SERVICE_NAME,
} from '@app/shared/common/proto/news.pb';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NewscacheService } from './newscache.service';

@Controller()
export class NewscacheController {
  constructor(private readonly newscacheService: NewscacheService) {}

  @Get()
  getHello(): Promise<any> {
    return this.newscacheService.getHello();
  }

  @Get('news')
  getNews() {
    const news_arr = this.newscacheService.findNews();
    console.log(news_arr);
    return this.newscacheService.findNews();
  }

  @GrpcMethod(NEWS_CACHING_SERVICE_NAME, 'BeginCaching')
  async beginCaching(data): Promise<BeginCachingResponse> {
    console.log(`Begin Caching request received ${data}`);
    this.newscacheService.findNews();
    return { success: true };
  }
}
