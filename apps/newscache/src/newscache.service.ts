import { News } from '@app/shared/entities/news.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NewscacheService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}
  getHello(): string {
    return 'Hello World! I am newscache service';
  }

  findNews(): Promise<News[]> {
    return this.newsRepository.find({
      take: 2,
    });
  }
}
