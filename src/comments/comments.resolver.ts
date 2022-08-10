import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NewsCommentsService, NewsRepliesService } from './comments.service';
import { NewsComment, NewsReply } from './entities/comment.entity';
import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
} from './dto/create-comment.input';
import {
  UpdateNewsCommentInput,
  UpdateNewsReplyInput,
} from './dto/update-comment.input';

@Resolver(() => NewsComment)
export class NewsCommentsResolver {
  constructor(private readonly newsCommentsService: NewsCommentsService) {}

  @Mutation(() => NewsComment)
  createNewsComment(
    @Args('createNewsCommentInput')
    createNewsCommentInput: CreateNewsCommentInput,
  ) {
    return this.newsCommentsService.create(createNewsCommentInput);
  }

  @Query(() => [NewsComment], { name: 'newsComments' })
  findAll(@Args('newsId', { type: () => Int }) newsId: number) {
    return this.newsCommentsService.findAll(newsId);
  }

  @Query(() => NewsComment, { name: 'newsComment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.newsCommentsService.findOne(id);
  }

  @Mutation(() => NewsComment)
  updateNewsComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNewsCommentInput')
    updateNewsCommentInput: UpdateNewsCommentInput,
  ) {
    return this.newsCommentsService.update(id, updateNewsCommentInput);
  }

  @Mutation(() => NewsComment)
  removeNewsComment(@Args('id', { type: () => Int }) id: number) {
    return this.newsCommentsService.remove(id);
  }

  @ResolveField(() => Int)
  replyCount(@Parent() newsComment: NewsComment) {
    const commentId = newsComment.id;
    return this.newsCommentsService.countReplies(commentId);
  }
}

@Resolver(() => NewsReply)
export class NewsRepliesResolver {
  constructor(private readonly newsReplyService: NewsRepliesService) {}

  @Mutation(() => NewsReply)
  createNewsReply(
    @Args('createNewsReplyInput')
    createNewsReplyInput: CreateNewsReplyInput,
  ) {
    return this.newsReplyService.create(createNewsReplyInput);
  }

  @Query(() => [NewsReply], { name: 'newsReplies' })
  findAll(@Args('newsCommentId', { type: () => Int }) newsCommentId: number) {
    return this.newsReplyService.findAll(newsCommentId);
  }

  @Mutation(() => NewsReply)
  updateNewsReply(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNewsReplyInput')
    updateNewsReplyInput: UpdateNewsReplyInput,
  ) {
    return this.newsReplyService.update(id, updateNewsReplyInput);
  }

  @Mutation(() => NewsReply)
  removeNewsReply(@Args('id', { type: () => Int }) id: number) {
    return this.newsReplyService.remove(id);
  }
}
