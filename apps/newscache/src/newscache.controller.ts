import { Controller, Get } from '@nestjs/common';
import { NewscacheService } from './newscache.service';

@Controller()
export class NewscacheController {
  constructor(private readonly newscacheService: NewscacheService) {}

  @Get()
  getHello(): string {
    return this.newscacheService.getHello();
  }

  @Get('news')
  getNews() {
    const news_arr = this.newscacheService.findNews();
    console.log(news_arr);
    return this.newscacheService.findNews();
  }
}
