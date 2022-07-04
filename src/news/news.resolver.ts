import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
import { HttpException } from '@nestjs/common';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Mutation(() => News)
  createNews(@Args('createNewsInput') createNewsInput: CreateNewsInput) {
    return this.newsService.create(createNewsInput);
  }

  @Query(() => [News], { name: 'news' })
  findAll() {
    return this.newsService.findAll();
  }

  @Query(() => News, { name: 'newsById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.newsService.findOne(id);
  }

  @Mutation(() => News)
  updateNews(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateNewsInput') updateNewsInput: UpdateNewsInput,
  ): News|HttpException {
    return this.newsService.update(id, updateNewsInput);
  }

  @Mutation(() => News)
  removeNews(
    @Args('id', { type: () => Int }) id: number,
  ): News | HttpException {
    return this.newsService.remove(id);
  }
}
