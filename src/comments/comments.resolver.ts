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
import { UsersService } from 'src/users/users.service';
import { Author } from 'src/users/entitiy/users.entity';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from './entities/comment.entity';
import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
  CreateUserLikesNewsCommentInput,
  CreateUserLikesNewsReplyInput,
} from './dto/create-comment.input';
import {
  UpdateNewsCommentInput,
  UpdateNewsReplyInput,
  UpdateUserLikesNewsCommentInput,
  UpdateUserLikesNewsReplyInput,
} from './dto/update-comment.input';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import CommentsResponse, { RepliesResponse } from './comments.response';
import { ReactCount } from 'src/common/entities/base.entity';
import { getAuthor } from 'src/users/users.resolver';

@Resolver(() => NewsComment)
export class NewsCommentsResolver {
  constructor(
    private readonly newsCommentsService: NewsCommentsService,
    private readonly newsCommentsLikeService: UserLikesNewsCommentService,
    private readonly userService: UsersService,
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

  @Query(() => CommentsResponse, { name: 'newsComments' })
  async findAll(
    @Args('newsId', { type: () => Int }) newsId: number,
    @Args() args: ConnectionArgs,
  ): Promise<CommentsResponse> {
    const { limit, offset } = args.pagingParams();
    const [comments, count] = await this.newsCommentsService.findAll(
      newsId,
      limit,
      offset,
    );
    const page = connectionFromArraySlice(comments, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count, limit, offset, curTime: new Date() } };
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

  @ResolveField(() => ReactCount)
  async reactCounts(@Parent() newsComment: NewsComment) {
    const { id } = newsComment;
    const reactCount = await this.newsCommentsService.countReacts(id);
    return reactCount;
  }

  @ResolveField(() => Author)
  async authorDetail(@Parent() newsComment: NewsComment): Promise<Author> {
    const { author } = newsComment;
    const authDetail = getAuthor(this.userService, author);
    return authDetail;
  }
}

@Resolver(() => NewsReply)
export class NewsRepliesResolver {
  constructor(
    private readonly newsReplyService: NewsRepliesService,
    private readonly newsReplyLikeService: UserLikesNewsReplyService,
    private readonly userService: UsersService,
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

  @Query(() => RepliesResponse, { name: 'newsReplies' })
  async findAll(
    @Args('newsCommentId', { type: () => Int }) newsCommentId: number,
    @Args() args: ConnectionArgs,
  ): Promise<RepliesResponse> {
    const { limit, offset } = args.pagingParams();
    const [replies, count] = await this.newsReplyService.findAll(
      newsCommentId,
      limit,
      offset,
    );
    const page = connectionFromArraySlice(replies, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count, limit, offset, curTime: new Date() } };
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

  @ResolveField(() => ReactCount)
  async reactCounts(@Parent() newsReply: NewsReply) {
    const { id } = newsReply;
    const reactCount = await this.newsReplyService.countReacts(id);
    return reactCount;
  }

  @ResolveField(() => Author)
  async authorDetail(@Parent() newsReply: NewsReply): Promise<Author> {
    const { author } = newsReply;
    return getAuthor(this.userService, author);
  }

  @ResolveField(() => Author)
  async repliedToDetail(@Parent() newsReply: NewsReply) {
    const { repliedTo } = newsReply;
    return getAuthor(this.userService, repliedTo);
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
    @Args('createUserLikesNewsCommentInput')
    createUserLikesNewsCommentInput: CreateUserLikesNewsCommentInput,
  ) {
    checkUserAuthenticated(user);
    console.log(`hello from like ${user}`);
    return await this.userLikesNewsCommentService.create(
      createUserLikesNewsCommentInput,
      user,
    );
  }

  @Mutation(() => UserLikesNewsComment)
  async updateUserLikesNewsComment(
    @Args('commentId', { type: () => Int }) commentId: number,
    @Args('updateUserLikesNewsCommentInput')
    updateUserLikesNewsCommentInput: UpdateUserLikesNewsCommentInput,
    @User() user: number,
  ) {
    console.log(`hello from update like ${user}`);
    checkUserAuthenticated(user);
    return await this.userLikesNewsCommentService.update(
      commentId,
      updateUserLikesNewsCommentInput,
      user,
    );
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
    @Args('createUserLikesNewsReplyInput')
    createUserLikesNewsReplyInput: CreateUserLikesNewsReplyInput,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsReplyService.create(
      createUserLikesNewsReplyInput,
      user,
    );
  }

  @Mutation(() => UserLikesNewsReply)
  async updateUserLikesNewsReply(
    @Args('replyId', { type: () => Int }) replyId: number,
    @Args('updateUserLikesNewsReplyInput')
    updateUserLikesNewsReplyInput: UpdateUserLikesNewsReplyInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.userLikesNewsReplyService.update(
      replyId,
      updateUserLikesNewsReplyInput,
      user,
    );
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
