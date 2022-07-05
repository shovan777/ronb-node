import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
import { NotFoundException } from '@nestjs/common';
import { createWriteStream, mkdir } from 'fs';
import { join } from 'path';

// const fileUpload = (fileName, uploadDir) => {

// };

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Mutation(() => News)
  async createNews(@Args('createNewsInput') createNewsInput: CreateNewsInput) {
    return await this.newsService.create(createNewsInput);
  }

  @Query(() => [News], { name: 'news' })
  findAll() {
    return this.newsService.findAll();
  }

  @Query(() => News, { name: 'newsById' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): News | NotFoundException {
    return this.newsService.findOne(id);
  }

  @Mutation(() => News)
  async updateNews(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateNewsInput') updateNewsInput: UpdateNewsInput,
  ) {
    return await this.newsService.update(id, updateNewsInput);
  }

  @Mutation(() => News)
  removeNews(
    @Args('id', { type: () => Int }) id: number,
  ): News | NotFoundException {
    return this.newsService.remove(id);
  }
}
