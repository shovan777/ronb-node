import { News } from '@app/shared/entities/news.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
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
    const twoNews = await this.newsRepository.find({ take: 2 });
    console.log(`setting in cache: ${twoNews}`);
    await this.cacheManager.set('news', twoNews);
    return twoNews;
  }
}
