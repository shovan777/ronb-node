import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ArgsType,
} from '@nestjs/graphql';
import { NewsTaggitService, TagsService } from './tags.service';
import { NewsTaggit, Tag } from '@app/shared/entities/tags.entity';
import { CreateNewsTaggitInput, CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { connectionFromArraySlice } from 'graphql-relay';
import { NotFoundException } from '@nestjs/common';
import { User } from '@app/shared/common/decorators/user.decorator';
import { checkUserAuthenticated } from '@app/shared/common/utils/checkUserAuthentication';
import { Roles } from '@app/shared/common/decorators/roles.decorator';
import { Role } from '@app/shared/common/enum/role.enum';
import { MakePublic } from '@app/shared/common/decorators/public.decorator';

@Resolver(() => Tag)
@Roles(Role.Admin, Role.SuperAdmin, Role.Publisher, Role.Writer)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation(() => Tag)
  async createTag(
    @Args('createTagInput') createTagInput: CreateTagInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.tagsService.create(createTagInput, user);
  }

  @Query(() => [Tag], { name: 'tags' })
  @MakePublic()
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }
}

@Resolver(() => NewsTaggit)
@Roles(Role.Admin, Role.SuperAdmin, Role.Publisher, Role.Writer)
export class NewsTaggitResolver {
  constructor(private readonly newsTaggitService: NewsTaggitService) {}

  @Mutation(() => NewsTaggit)
  async createNewsTaggit(
    @Args('createNewsTaggitInput') createNewsTaggitInput: CreateNewsTaggitInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.newsTaggitService.create(createNewsTaggitInput, user);
  }

  @Query(() => [NewsTaggit], { name: 'newsTaggit' })
  @MakePublic()
  async findAll(): // @ArgsType('filter', {nullable:true})
  // filter?:
  Promise<NewsTaggit[]> {
    return this.newsTaggitService.findAll();
  }

  @Mutation(() => NewsTaggit)
  removeNewsTaggit(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<NotFoundException | any> {
    checkUserAuthenticated(user);
    return this.newsTaggitService.remove(id);
  }
}
