import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReacts } from '@app/shared/common/entities/base.entity';
import { checkUserIsAuthor } from '@app/shared/common/utils/checkUserAuthentication';
import { NewsService } from '../news/news.service';
import { Repository } from 'typeorm';
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
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from '@app/shared/entities/comment.entity';

@Injectable()
export class NewsCommentsService {
  constructor(
    @InjectRepository(NewsComment)
    private newsCommentRepository: Repository<NewsComment>,
    private readonly newsService: NewsService,
  ) {}

  async create(
    createCommentInput: CreateNewsCommentInput,
    user: number,
  ): Promise<NewsComment> {
    let commentInputData: any = {
      ...createCommentInput,
    };
    const news = await this.newsService.findOne(createCommentInput.news);
    commentInputData = {
      ...commentInputData,
      news: news,
    };
    return this.newsCommentRepository.save({
      ...commentInputData,
      author: user,
    });
  }

  async findAll(
    newsId: number,
    limit: number,
    offset: number,
  ): Promise<[NewsComment[], number]> {
    return this.newsCommentRepository.findAndCount({
      where: {
        news: { id: newsId },
      },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
      // relations: { news: true },
    });
  }

  async findOne(id: number) {
    const newsComment = await this.newsCommentRepository.findOne({
      where: {
        id,
      },
    });
    if (!newsComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return newsComment;
  }

  async findOneWithNews(id: number) {
    const newsComment = await this.newsCommentRepository.findOne({
      where: {
        id,
      },
      relations: { news: true },
    });
    if (!newsComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return newsComment;
  }

  async update(
    id: number,
    updateCommentInput: UpdateNewsCommentInput,
    user: number,
  ): Promise<NewsComment> {
    const comment: NewsComment = await this.findOne(id);
    checkUserIsAuthor(user, comment.author);
    return this.newsCommentRepository.save({
      ...comment,
      ...updateCommentInput,
    });
  }

  async remove(id: number, user: number) {
    const comment: NewsComment = await this.findOne(id);
    checkUserIsAuthor(user, comment.author);
    await this.newsCommentRepository.delete(comment.id);
    return comment;
  }

  async countReplies(commentId: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id: commentId },
      relations: { replies: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return comment.replies.length;
  }

  async countLikes(commentId: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id: commentId },
      relations: { likes: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return comment.likes.length;
  }
  // async findUserLikesNewsComment(commentId: number, user: number) {
  //   const comment = await this.newsCommentLikeService.findOne(commentId, user);
  //   return comment;
  // }

  async countReacts(commentId: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id: commentId },
      relations: { likes: true },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    const reactCounts = {};
    Object.values(UserReacts).forEach((react) => {
      reactCounts[react] = 0;
    });
    comment.likes.forEach((like) => {
      reactCounts[like.react] += 1;
    });
    // reactCounts['total'] = comment.likes.length;
    return reactCounts;
  }
}

@Injectable()
export class NewsRepliesService {
  constructor(
    @InjectRepository(NewsReply)
    private newsReplyRepository: Repository<NewsReply>,
    private newsCommentService: NewsCommentsService,
  ) {}
  async create(
    createReplyInput: CreateNewsReplyInput,
    user: number,
  ): Promise<NewsComment> {
    let commentInputData: any = {
      ...createReplyInput,
    };
    const commentId = createReplyInput.comment;
    const comment = await this.newsCommentService.findOne(commentId);
    commentInputData = {
      ...commentInputData,
      comment: comment,
      author: user,
    };
    return this.newsReplyRepository.save({
      ...commentInputData,
    });
  }

  async findAll(
    commentId: number,
    limit: number,
    offset: number,
  ): Promise<[NewsReply[], number]> {
    return this.newsReplyRepository.findAndCount({
      where: {
        comment: { id: commentId },
      },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<NewsReply> {
    const newsReply: NewsReply = await this.newsReplyRepository.findOne({
      where: { id },
      relations: { comment: true },
    });
    if (!newsReply) {
      throw new NotFoundException(`Reply with id ${id} not found`);
    }
    return newsReply;
  }

  async update(
    id: number,
    updateReplyInput: UpdateNewsReplyInput,
    user: number,
  ): Promise<NewsReply> {
    const reply: NewsReply = await this.findOne(id);
    checkUserIsAuthor(user, reply.author);
    return this.newsReplyRepository.save({
      ...reply,
      ...updateReplyInput,
    });
  }

  async remove(id: number, user: number): Promise<NewsReply> {
    const reply: NewsReply = await this.findOne(id);
    checkUserIsAuthor(user, reply.author);
    await this.newsReplyRepository.delete(reply.id);
    return reply;
  }

  async countLikes(replyId: number) {
    const reply = await this.newsReplyRepository.findOne({
      where: { id: replyId },
      relations: { likes: true },
    });
    if (!reply) {
      throw new NotFoundException(`Reply with id ${replyId} not found`);
    }
    return reply.likes.length;
  }

  async countReacts(replyId: number) {
    const reply = await this.newsReplyRepository.findOne({
      where: { id: replyId },
      relations: { likes: true },
    });
    if (!reply) {
      throw new NotFoundException(`Reply with id ${replyId} not found`);
    }
    const reactCounts = {};
    Object.values(UserReacts).forEach((react) => {
      reactCounts[react] = 0;
    });
    reply.likes.forEach((like) => {
      reactCounts[like.react] += 1;
    });
    // reactCounts['total'] = reply.likes.length;
    return reactCounts;
  }
}

@Injectable()
export class UserLikesNewsCommentService {
  constructor(
    @InjectRepository(UserLikesNewsComment)
    private userLikesNewsCommentRepository: Repository<UserLikesNewsComment>,
    private newsCommentService: NewsCommentsService,
  ) {}
  async create(
    createUserLikesNewsCommentInput: CreateUserLikesNewsCommentInput,
    user: number,
  ): Promise<UserLikesNewsComment> {
    const commentId = createUserLikesNewsCommentInput.commentId;
    const comment = await this.newsCommentService.findOne(commentId);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return this.userLikesNewsCommentRepository.save({
      comment: comment,
      userId: user,
      react: createUserLikesNewsCommentInput.react,
    });
  }

  async findOne(commentId: number, user: number) {
    const userLikesNewsComment =
      await this.userLikesNewsCommentRepository.findOne({
        where: {
          comment: { id: commentId },
          userId: user,
        },
      });
    return userLikesNewsComment;
  }

  async update(
    commentId: number,
    updateUserLikesNewsCommentInput: UpdateUserLikesNewsCommentInput,
    user: number,
  ): Promise<UserLikesNewsComment> {
    const commentLike: UserLikesNewsComment = await this.findOne(
      commentId,
      user,
    );
    checkUserIsAuthor(user, commentLike.userId);
    return this.userLikesNewsCommentRepository.save({
      ...commentLike,
      ...updateUserLikesNewsCommentInput,
    });
  }

  async remove(commentId: number, user: number) {
    const userLikesNewsComment = await this.findOne(commentId, user);
    if (!userLikesNewsComment) {
      throw new NotFoundException(
        `User id ${user} has not liked the comment with id ${commentId}`,
      );
    }
    const removedUserLikesNewsComment = { ...userLikesNewsComment };
    await this.userLikesNewsCommentRepository.remove(userLikesNewsComment);
    return removedUserLikesNewsComment;
  }
}

@Injectable()
export class UserLikesNewsReplyService {
  constructor(
    @InjectRepository(UserLikesNewsReply)
    private userLikesNewsReplyRepository: Repository<UserLikesNewsReply>,
    private newsReplyService: NewsRepliesService,
  ) {}
  async create(
    userLikesNewsReplyInput: CreateUserLikesNewsReplyInput,
    user: number,
  ): Promise<UserLikesNewsReply | NotFoundException> {
    const replyId = userLikesNewsReplyInput.replyId;
    const reply = await this.newsReplyService.findOne(replyId);
    if (!reply) {
      return new NotFoundException(`Reply with id ${replyId} not found`);
    }
    return this.userLikesNewsReplyRepository.save({
      reply: reply,
      userId: user,
      react: userLikesNewsReplyInput.react,
    });
  }

  async findOne(replyId: number, user: number) {
    const UserLikesNewsReplyService =
      await this.userLikesNewsReplyRepository.findOne({
        where: {
          reply: { id: replyId },
          userId: user,
        },
      });
    return UserLikesNewsReplyService;
  }

  async update(
    replyId: number,
    updateUserLikesNewsReplyInput: UpdateUserLikesNewsReplyInput,
    user: number,
  ): Promise<UserLikesNewsReply> {
    const replyLike: UserLikesNewsReply = await this.findOne(replyId, user);
    checkUserIsAuthor(user, replyLike.userId);
    return this.userLikesNewsReplyRepository.save({
      ...replyLike,
      ...updateUserLikesNewsReplyInput,
    });
  }

  async remove(replyId: number, user: number) {
    const userLikesNewsReply = await this.findOne(replyId, user);
    if (!userLikesNewsReply) {
      throw new NotFoundException(
        `User id ${user} has not liked the reply with id ${replyId}`,
      );
    }
    const removedUserLikesNewsReply = { ...userLikesNewsReply };
    await this.userLikesNewsReplyRepository.remove(userLikesNewsReply);
    return removedUserLikesNewsReply;
  }
}
