import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/decorators/user.decorator';
import {
  checkUserAuthenticated,
  checkUserIsAuthor,
} from 'src/common/utils/checkUserAuthentication';
import { NewsService } from 'src/news/news.service';
import { Repository } from 'typeorm';
import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
} from './dto/create-comment.input';
import {
  UpdateNewsCommentInput,
  UpdateNewsReplyInput,
} from './dto/update-comment.input';
import {
  NewsComment,
  NewsReply,
  UserLikesNewsComment,
  UserLikesNewsReply,
} from './entities/comment.entity';

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

  async findAll(newsId: number): Promise<NewsComment[]> {
    return this.newsCommentRepository.find({
      where: {
        news: { id: newsId },
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

  async findAll(commentId: number): Promise<NewsReply[]> {
    return this.newsReplyRepository.find({
      where: {
        comment: { id: commentId },
      },
    });
  }

  async findOne(id: number): Promise<NewsReply> {
    const newsReply: NewsReply = await this.newsReplyRepository.findOne({
      where: { id },
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
}

@Injectable()
export class UserLikesNewsCommentService {
  constructor(
    @InjectRepository(UserLikesNewsComment)
    private userLikesNewsCommentRepository: Repository<UserLikesNewsComment>,
    private newsCommentService: NewsCommentsService,
  ) {}
  async create(commentId: number, user: number): Promise<UserLikesNewsComment> {
    const comment = await this.newsCommentService.findOne(commentId);
    return this.userLikesNewsCommentRepository.save({
      comment: comment,
      userId: user,
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
  async create(replyId: number, user: number): Promise<UserLikesNewsReply> {
    const reply = await this.newsReplyService.findOne(replyId);
    return this.userLikesNewsReplyRepository.save({
      reply: reply,
      userId: user,
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
