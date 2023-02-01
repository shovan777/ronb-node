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
  UserInterestsService,
  UserLikesNewsService,
} from './news.service';
import {
  News,
  NewsCategory,
  NewsImage,
  UserInterests,
  UserLikesNews,
} from './entities/news.entity';
import {
  CreateNewsCategoryInput,
  CreateNewsInput,
  CreateUserInterestsInput,
  CreateUserLikesNewsInput,
} from './dto/create-news.input';
import {
  UpdateNewsCategoryInput,
  UpdateNewsInput,
} from './dto/update-news.input';
import { NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common';
import NewsResponse from './news.response';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { FilterNewsInput } from './dto/filter-news.input';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import { NewsTaggit, Tag } from 'src/tags/entities/tag.entity';
import { NewsTaggitService, TagsService } from 'src/tags/tags.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MakePublic } from 'src/common/decorators/public.decorator';

// const fileUpload = (fileName, uploadDir) => {

// };

@Resolver(() => News)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class NewsResolver {
  constructor(
    private readonly newsService: NewsService,
    private readonly newsTaggitService: NewsTaggitService,
  ) {}

  @Mutation(() => News)
  @Roles(Role.Writer)
  async createNews(
    @Args('createNewsInput') createNewsInput: CreateNewsInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.newsService.create(createNewsInput, user);
  }

  @Query(() => NewsResponse, { name: 'news' })
  @MakePublic()
  async findAll(
    @Args() args: ConnectionArgs,
    @Args('filterNewsInput', { nullable: true })
    filterNewsInput?: FilterNewsInput,
  ): Promise<NewsResponse> {
    const { limit, offset } = args.pagingParams();
    const [news, count] = await this.newsService.findAllSearch(
      limit,
      offset,
      filterNewsInput,
      true, // show only published news
    );
    const page = connectionFromArraySlice(news, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset, curTime: new Date() } };
  }

  @Query(() => NewsResponse, { name: 'newsAdmin' })
  @Roles(Role.Writer)
  async findAllAdmin(
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

    return { page, pageData: { count, limit, offset, curTime: new Date() } };
  }

  @Query(() => News, { name: 'newsById' })
  @MakePublic()
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<News | NotFoundException> {
    return this.newsService.findOne(id);
  }

  @ResolveField(() => [NewsImage])
  @MakePublic()
  async images(@Parent() news: News) {
    const { id } = news;
    if (news.images) {
      return news.images;
    }
    return await this.newsService.findImagesofNews(id);
  }

  @ResolveField(() => UserLikesNews)
  @MakePublic()
  async like(@Parent() news: News, @User() user: number) {
    const { id } = news;
    if (!user) {
      return null;
    }
    return await this.newsService.findUserLikesNews(id, user);
  }

  @ResolveField(() => Int)
  @MakePublic()
  async likeCount(@Parent() news: News) {
    const { id } = news;
    return await this.newsService.countLikes(id);
  }

  @ResolveField(() => Int)
  @MakePublic()
  async commentCount(@Parent() news: News) {
    const { id } = news;
    return await this.newsService.countComments(id);
  }

  @ResolveField(() => NewsCategory)
  @MakePublic()
  async category(@Parent() news: News) {
    const { id } = news;
    // console.log(news);
    if (news.category) {
      return news.category;
    }
    return await this.newsService.findCategoryofNews(id);
  }

  @ResolveField(() => [NewsTaggit], { nullable: true })
  @MakePublic()
  async tags(@Parent() news: News) {
    const { id } = news;
    if (news.tags) {
      return news.tags;
    }
    return await this.newsTaggitService.findAllByNews(id);
  }

  @Mutation(() => News)
  async updateNews(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateNewsInput') updateNewsInput: UpdateNewsInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.newsService.update(id, updateNewsInput, user);
  }

  @Mutation(() => News)
  removeNews(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<NotFoundException | any> {
    checkUserAuthenticated(user);
    return this.newsService.remove(id);
  }

  @Mutation(() => NewsImage)
  removeNewsImage(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<NotFoundException | any> {
    checkUserAuthenticated(user);
    return this.newsService.removeImage(id);
  }
}

@Resolver(() => NewsCategory)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class NewsCategoryResolver {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Query(() => [NewsCategory], { name: 'newsCategories' })
  @MakePublic()
  async findAll(): Promise<NewsCategory[]> {
    return this.newsCategoryService.findAll();
  }

  @Query(() => NewsCategory, { name: 'newsCategoryById' })
  @MakePublic()
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<NewsCategory | NotFoundException> {
    return this.newsCategoryService.findOne(id);
  }

  @Mutation(() => NewsCategory)
  @Roles(Role.Writer)
  async createNewsCategory(
    @Args('createNewsCategoryInput')
    createNewsCategoryInput: CreateNewsCategoryInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.newsCategoryService.create(createNewsCategoryInput, user);
  }

  @Mutation(() => NewsCategory)
  async updateNewsCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNewsCategoryInput')
    updateNewsCategoryInput: UpdateNewsCategoryInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.newsCategoryService.update(
      id,
      updateNewsCategoryInput,
      user,
    );
  }

  @Mutation(() => NewsCategory)
  async removeNewsCategory(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsCategoryService.remove(id);
  }
}

@Resolver(() => UserLikesNews)
export class UserLikesNewsResolver {
  constructor(private readonly userLikesNewsService: UserLikesNewsService) {}
  // checkUserAuthenticated(user: number) {
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  // }

  @Mutation(() => UserLikesNews)
  async createUserLikesNews(
    @User() user: number,
    @Args('createUserLikesNewsInput')
    createUserLikesNewsInput: CreateUserLikesNewsInput,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsService.create(
      createUserLikesNewsInput,
      user,
    );
  }

  @Mutation(() => UserLikesNews)
  async removeUserLikesNews(
    @User() user: number,
    @Args('newsId', { type: () => Int }) newsId: number,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsService.remove(newsId, user);
  }
}

@Resolver(() => UserInterests)
export class UserInterestsResolver {
  constructor(
    private readonly userInterestsService: UserInterestsService,
    private readonly tagService: TagsService,
  ) {}

  @Mutation(() => UserInterests)
  async createUserInterests(
    @User() user: number,
    @Args('createUserInterestsInput')
    createUserInterestsInput: CreateUserInterestsInput,
  ) {
    checkUserAuthenticated(user);
    return await this.userInterestsService.create(
      createUserInterestsInput,
      user,
    );
  }

  @Query(() => [Tag], { name: 'instrestingTags' })
  async findInsterestingTags(@User() user: number) {
    checkUserAuthenticated(user);
    return await this.tagService.findInsterestingTags(user);
  }

  // @Mutation(() => UserInterests)
  // async removeUserInterests(
  //   @User() user: number,
  //   @Args('newsCategoryId', { type: () => Int }) newsCategoryId: number,
  // ) {
  //   checkUserAuthenticated(user);
  //   return await this.userInterestsService.remove(newsCategoryId, user);
  // }
}
