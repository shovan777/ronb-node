import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NewsCommentsService } from './comments.service';
import { NewsComment } from './entities/comment.entity';
import { CreateNewsCommentInput } from './dto/create-comment.input';
import { UpdateNewsCommentInput } from './dto/update-comment.input';

@Resolver(() => NewsComment)
export class NewsCommentsResolver {
  constructor(private readonly NewsCommentsService: NewsCommentsService) {}

  @Mutation(() => NewsComment)
  createNewsComment(
    @Args('createNewsCommentInput')
    createNewsCommentInput: CreateNewsCommentInput,
  ) {
    return this.NewsCommentsService.create(createNewsCommentInput);
  }

  @Query(() => [NewsComment], { name: 'newsComments' })
  findAll(@Args('newsId', { type: () => Int }) newsId: number) {
    return this.NewsCommentsService.findAll(newsId);
  }

  @Query(() => NewsComment, { name: 'newsComment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.NewsCommentsService.findOne(id);
  }

  @Mutation(() => NewsComment)
  updateNewsComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNewsCommentInput')
    updateNewsCommentInput: UpdateNewsCommentInput,
  ) {
    return this.NewsCommentsService.update(id, updateNewsCommentInput);
  }

  @Mutation(() => NewsComment)
  removeNewsComment(@Args('id', { type: () => Int }) id: number) {
    return this.NewsCommentsService.remove(id);
  }
}
