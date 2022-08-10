import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsService } from 'src/news/news.service';
import { Repository } from 'typeorm';
import { CreateNewsCommentInput } from './dto/create-comment.input';
import { UpdateNewsCommentInput } from './dto/update-comment.input';
import { NewsComment } from './entities/comment.entity';

@Injectable()
export class NewsCommentsService {
  constructor(
    @InjectRepository(NewsComment)
    private newsCommentRepository: Repository<NewsComment>,
    private readonly newsService: NewsService,
  ) {}

  async create(
    createCommentInput: CreateNewsCommentInput,
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
      author: 2,
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

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: number,
    updateCommentInput: UpdateNewsCommentInput,
  ): Promise<NewsComment> {
    const comment = await this.newsCommentRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.newsCommentRepository.save({
      ...comment,
      ...updateCommentInput,
    });
  }

  async remove(id: number) {
    const comment = await this.newsCommentRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    await this.newsCommentRepository.delete(comment.id);
    return comment;
  }
}
