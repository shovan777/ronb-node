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
  NewsCommentsService,
  NewsRepliesService,
  UserLikesNewsCommentService,
  UserLikesNewsReplyService,
} from './comments.service';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from './entities/comment.entity';
import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
} from './dto/create-comment.input';
import {
  UpdateNewsCommentInput,
  UpdateNewsReplyInput,
} from './dto/update-comment.input';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';

@Resolver(() => NewsComment)
export class NewsCommentsResolver {
  constructor(
    private readonly newsCommentsService: NewsCommentsService,
    private readonly newsCommentsLikeService: UserLikesNewsCommentService,
  ) {}

  @Mutation(() => NewsComment)
  createNewsComment(
    @Args('createNewsCommentInput')
    createNewsCommentInput: CreateNewsCommentInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsCommentsService.create(createNewsCommentInput, user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsCommentsService.update(id, updateNewsCommentInput, user);
  }

  @Mutation(() => NewsComment)
  removeNewsComment(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsCommentsService.remove(id, user);
  }

  @ResolveField(() => Int)
  replyCount(@Parent() newsComment: NewsComment) {
    const commentId = newsComment.id;
    return this.newsCommentsService.countReplies(commentId);
  }

  @ResolveField(() => UserLikesNewsComment)
  async like(@Parent() newsComment: NewsComment, @User() user: number) {
    const { id } = newsComment;
    if (!user) {
      return null;
    }
    return await this.newsCommentsLikeService.findOne(id, user);
  }

  @ResolveField(() => Int)
  async likeCount(@Parent() newsComment: NewsComment) {
    const { id } = newsComment;
    return await this.newsCommentsService.countLikes(id);
  }
}

@Resolver(() => NewsReply)
export class NewsRepliesResolver {
  constructor(
    private readonly newsReplyService: NewsRepliesService,
    private readonly newsReplyLikeService: UserLikesNewsReplyService,
  ) {}

  @Mutation(() => NewsReply)
  createNewsReply(
    @Args('createNewsReplyInput')
    createNewsReplyInput: CreateNewsReplyInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsReplyService.create(createNewsReplyInput, user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsReplyService.update(id, updateNewsReplyInput, user);
  }

  @Mutation(() => NewsReply)
  removeNewsReply(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.newsReplyService.remove(id, user);
  }

  @ResolveField(() => UserLikesNewsReply)
  async like(@Parent() newsReply: NewsReply, @User() user: number) {
    const { id } = newsReply;
    if (!user) {
      return null;
    }
    return await this.newsReplyLikeService.findOne(id, user);
  }

  @ResolveField(() => Int)
  async likeCount(@Parent() newsReply: NewsReply) {
    const { id } = newsReply;
    return await this.newsReplyService.countLikes(id);
  }
}

@Resolver(() => UserLikesNewsComment)
export class UserLikesNewsCommentResolver {
  constructor(
    private readonly userLikesNewsCommentService: UserLikesNewsCommentService,
  ) {}

  @Mutation(() => UserLikesNewsComment)
  async createUserLikesNewsComment(
    @User() user: number,
    @Args('commentId', { type: () => Int }) commentId: number,
  ) {
    checkUserAuthenticated(user);
    console.log(`hello from like ${user}`);
    return await this.userLikesNewsCommentService.create(commentId, user);
  }

  @Mutation(() => UserLikesNewsComment)
  async removeUserLikesNewsComment(
    @User() user: number,
    @Args('commentId', { type: () => Int }) commentId: number,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsCommentService.remove(commentId, user);
  }
}

@Resolver(() => UserLikesNewsReply)
export class UserLikesNewsReplyResolver {
  constructor(
    private readonly userLikesNewsReplyService: UserLikesNewsReplyService,
  ) {}

  @Mutation(() => UserLikesNewsReply)
  async createUserLikesNewsReply(
    @User() user: number,
    @Args('replyId', { type: () => Int }) replyId: number,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsReplyService.create(replyId, user);
  }

  @Mutation(() => UserLikesNewsReply)
  async removeUserLikesNewsReply(
    @User() user: number,
    @Args('replyId', { type: () => Int }) replyId: number,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsReplyService.remove(replyId, user);
  }
}
