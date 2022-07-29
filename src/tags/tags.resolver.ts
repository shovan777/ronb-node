import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import TagsResponse from './tags.response';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation(() => Tag)
  async createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    return await this.tagsService.create(createTagInput);
  }

  @Query(() => TagsResponse, { name: 'tags' })
  async findAll(
    @Args() args: ConnectionArgs,
  ): Promise<TagsResponse> {
    const { limit, offset } = args.pagingParams();
    const [tags, count] = await this.tagsService.findAll(limit, offset);
    const page = connectionFromArraySlice(tags, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count, limit, offset } };
  }

  // @Query(() => Tag, { name: 'tag' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.tagsService.findOne(id);
  // }

  // @Mutation(() => Tag)
  // updateTag(@Args('updateTagInput') updateTagInput: UpdateTagInput) {
  //   return this.tagsService.update(updateTagInput.id, updateTagInput);
  // }

  // @Mutation(() => Tag)
  // removeTag(@Args('id', { type: () => Int }) id: number) {
  //   return this.tagsService.remove(id);
  // }
}
