import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkUserIsAuthor } from 'src/common/utils/checkUserAuthentication';
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
import { NewsComment, NewsReply } from './entities/comment.entity';

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
}
