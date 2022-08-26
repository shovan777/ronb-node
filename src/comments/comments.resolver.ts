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
  PermissionService,
  UserLikesNewsCommentService,
  UserLikesNewsReplyService,
  UsersService,
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
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import CommentsResponse, { RepliesResponse } from './comments.response';

const getAuthor = async (service, id: number) => {
  return service.findOne(id).then((user) => {
    // console.log(user);
    return `${user.first_name} ${user.last_name}`;
  });
};

@Resolver(() => NewsComment)
export class NewsCommentsResolver {
  constructor(
    private readonly newsCommentsService: NewsCommentsService,
    private readonly newsCommentsLikeService: UserLikesNewsCommentService,
    private readonly userService: UsersService,
    private readonly permissionService: PermissionService,
  ) {}

  @Mutation(() => NewsComment)
  createNewsComment(
    @Args('createNewsCommentInput')
    createNewsCommentInput: CreateNewsCommentInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    // TODO: check if user has permission to create comment
    // console.log(user);
    // console.log(await this.permissionService.hasPermission(user,"can_review_news"));
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
    return { page, pageData: { count, limit, offset } };
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

  @ResolveField(() => String)
  async authorDetail(@Parent() newsComment: NewsComment) {
    const { author } = newsComment;
    return await getAuthor(this.userService, author);
    // return await this.userService.findOne(author).then((user) => user.username);
    // return author.name;
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
    return { page, pageData: { count, limit, offset } };
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

  @ResolveField(() => String)
  async authorDetail(@Parent() newsReply: NewsReply) {
    const { author } = newsReply;
    return await getAuthor(this.userService, author);
    // return await this.userService
    //   .findOne(author)
    //   .then((user) => `${user.firstname} ${user.lastname}`);
    // return author.name;
  }

  @ResolveField(() => String)
  async repliedToDetail(@Parent() newsReply: NewsReply) {
    const { repliedTo } = newsReply;
    return await getAuthor(this.userService, repliedTo);
    // return await this.userService
    //   .findOne(repliedTo)
    //   .then((user) => user.username);
    // return author.name;
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
