import { Resolver, Query, Mutation, Args, Int, ArgsType } from '@nestjs/graphql';
import { NewsTaggitService, TagsService } from './tags.service';
import { NewsTaggit, Tag } from './entities/tag.entity';
import { CreateNewsTaggitInput, CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation(() => Tag)
  async createTag(
    @Args('createTagInput') createTagInput: CreateTagInput,
    @User() user: number
  ) {
    checkUserAuthenticated(user);
    return await this.tagsService.create(createTagInput, user);
  }

  @Query(() => [Tag], { name: 'tags' })
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }
}

@Resolver(() => NewsTaggit)
export class NewsTaggitResolver {
  constructor(private readonly newsTaggitService: NewsTaggitService) {}

  @Mutation(() => NewsTaggit)
  async createNewsTaggit(
    @Args('createNewsTaggitInput') createNewsTaggitInput: CreateNewsTaggitInput,
    @User() user: number  
  ) {
    checkUserAuthenticated(user);
    return await this.newsTaggitService.create(createNewsTaggitInput, user);
  }

  @Query(() => [NewsTaggit], { name: 'newsTaggit' })
  async findAll(
    // @ArgsType('filter', {nullable:true})
    // filter?: 
  ): Promise<NewsTaggit[]> {
    return this.newsTaggitService.findAll();
  }

  @Mutation(() => NewsTaggit)
  removeNewsTaggit(@Args('id', {type: () => Int}) id: number,): Promise<NotFoundException | any> {
   return this.newsTaggitService.remove(id);
  }
}