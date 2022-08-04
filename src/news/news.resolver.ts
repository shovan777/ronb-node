import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  NewsCategoryService,
  NewsService,
  UserLikesNewsService,
} from './news.service';
import {
  News,
  NewsCategory,
  NewsImage,
  UserLikesNews,
} from './entities/news.entity';
import {
  CreateNewsCategoryInput,
  CreateNewsInput,
  CreateUserLikesNewsInput,
} from './dto/create-news.input';
import {
  UpdateNewsCategoryInput,
  UpdateNewsInput,
} from './dto/update-news.input';
import { NotFoundException } from '@nestjs/common';
import NewsResponse from './news.response';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { FilterNewsInput } from './dto/filter-news.input';
import { NewsTaggit } from 'src/tags/entities/tag.entity';
import { NewsTaggitService } from 'src/tags/tags.service';

// const fileUpload = (fileName, uploadDir) => {

// };

@Resolver(() => News)
export class NewsResolver {
  constructor(
      private readonly newsService: NewsService,
      private readonly newsTaggitService: NewsTaggitService,
    ) {}

  @Mutation(() => News)
  async createNews(@Args('createNewsInput') createNewsInput: CreateNewsInput) {
    // console.log(createNewsInput.singleImage);
    return await this.newsService.create(createNewsInput);
  }

  // @Query(() => [News], { name: 'news' })
  // findAll(): Promise<News[]> {
  //   return this.newsService.findAll();
  // }
  @Query(() => NewsResponse, { name: 'news' })
  async findAll(
    @Args() args: ConnectionArgs,
    @Args('filterNewsInput', { nullable: true })
    filterNewsInput?: FilterNewsInput,
  ): Promise<NewsResponse> {
    const { limit, offset } = args.pagingParams();
    const [news, count] = await this.newsService.findAll(
      limit,
      offset,
      filterNewsInput,
    );
    // return this.newsService.findAll();
    const page = connectionFromArraySlice(news, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => News, { name: 'newsById' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<News | NotFoundException> {
    return this.newsService.findOne(id);
  }

  @ResolveField(() => [NewsImage])
  async images(@Parent() news: News) {
    const { id } = news;
    // console.log(news);
    if (news.images) {
      return news.images;
    }
    return await this.newsService.findImagesofNews(id);
  }

  @ResolveField(() => UserLikesNews)
  async like(@Parent() news: News) {
    const { id } = news;
    return await this.newsService.findUserLikesNews(id);
  }

  @ResolveField(() => Int)
  async likeCount(@Parent() news: News) {
    const { id } = news;
    return await this.newsService.countLikes(id);
  }
  @ResolveField(() => NewsCategory)
  async category(@Parent() news: News) {
    const { id } = news;
    return await this.newsService.findCategoryofNews(id);
  }

  @ResolveField(() => [NewsTaggit], {nullable:true})
  async tags(@Parent() news: News) {
    const { id } = news;
    return await this.newsTaggitService.findAllByNews(id);
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
  ): Promise<NotFoundException | any> {
    return this.newsService.remove(id);
  }
}

@Resolver(() => NewsCategory)
export class NewsCategoryResolver {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Query(() => [NewsCategory], { name: 'newsCategories' })
  async findAll(): Promise<NewsCategory[]> {
    return this.newsCategoryService.findAll();
  }

  @Query(() => NewsCategory, { name: 'newsCategoryById' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<NewsCategory | NotFoundException> {
    return this.newsCategoryService.findOne(id);
  }

  @Mutation(() => NewsCategory)
  async createNewsCategory(
    @Args('createNewsCategoryInput')
    createNewsCategoryInput: CreateNewsCategoryInput,
  ) {
    return await this.newsCategoryService.create(createNewsCategoryInput);
  }

  @Mutation(() => NewsCategory)
  async updateNewsCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNewsCategoryInput')
    updateNewsCategoryInput: UpdateNewsCategoryInput,
  ) {
    return await this.newsCategoryService.update(id, updateNewsCategoryInput);
  }

  @Mutation(() => NewsCategory)
  async removeNewsCategory(@Args('id', { type: () => Int }) id: number) {
    return this.newsCategoryService.remove(id);
  }
}

@Resolver(() => UserLikesNews)
export class UserLikesNewsResolver {
  constructor(private readonly userLikesNewsService: UserLikesNewsService) {}

  @Mutation(() => UserLikesNews)
  async createUserLikesNews(
    @Args('createUserLikesNewsInput')
    createUserLikesNewsInput: CreateUserLikesNewsInput,
  ) {
    return await this.userLikesNewsService.create(createUserLikesNewsInput);
  }

  @Mutation(() => UserLikesNews)
  async removeUserLikesNews(
    @Args('newsId', { type: () => Int }) newsId: number,
  ) {
    return await this.userLikesNewsService.remove(newsId);
  }
}
