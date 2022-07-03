import { Injectable } from '@nestjs/common';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
import { News } from './interfaces/news.interface';

@Injectable()
export class NewsService {
  private readonly newsArr: News[] = [];
  create(news: CreateNewsInput) {
    // return 'This action adds a new news';
    const newsData: News = {
      ...news,
      id: this.newsArr.length + 1,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin', //TODO: get user from jwt
      updatedBy: 'admin',
      // category: 0,
    };
    return this.newsArr.push(newsData);
  }

  findAll() {
    // return `This action returns all news`;
    return this.newsArr;
  }

  findOne(id: number) {
    // return `This action returns a #${id} news`;
    return this.newsArr.find((news) => news.id === id);
  }

  update(id: number, updateNewsInput: UpdateNewsInput) {
    // return `This action updates a #${id} news`;
    const news = this.newsArr.find((news) => news.id === id);
    if (news) {
      const updatedNews = {
        ...news,
        ...updateNewsInput,
        updatedAt: new Date(),
        updatedBy: 'admin', //TODO: get user from jwt
      };
      this.newsArr[id] = updatedNews;
      return updatedNews;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
