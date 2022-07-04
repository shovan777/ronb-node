import { HttpException, Injectable } from '@nestjs/common';
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
      createdBy: 1, //TODO: get user from jwt
      updatedBy: 1,
      // category: 0,
    };
    // console.log(newsData);
    this.newsArr.push(newsData);
    return newsData;
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
        updatedBy: 1, //TODO: get user from jwt
      };
      this.newsArr[id] = updatedNews;
      return updatedNews;
    } else {
      return new HttpException('Not found', 404);
    }
  }

  remove(id: number) {
    const rmIndex = this.newsArr.findIndex((news) => news.id === id);
    if (rmIndex !== -1) {
      return this.newsArr.splice(rmIndex, 1)[0];
    } else {
      return new HttpException('Not found', 404);
    }
    // return `This action removes a #${id} news`;
  }
}
