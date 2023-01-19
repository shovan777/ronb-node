import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from 'src/common/utils/slugify';
import { News } from 'src/news/entities/news.entity';
import { NewsService } from 'src/news/news.service';
import { Raw, Repository } from 'typeorm';
import { CreateTagInput, CreateNewsTaggitInput } from './dto/create-tag.input';
import { NewsTaggit, Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagInput: CreateTagInput, user: number): Promise<Tag> {
    return this.tagRepository.save({
      ...createTagInput,
      createdBy: user,
      updatedBy: user,
    });
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOneById(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return tag;
  }

  async findOneByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { name },
    });
    return tag;
  }

  async findOneOrCreate(name: string, user: number): Promise<Tag> {
    const tag = await this.findOneByName(name);
    if (tag) {
      return tag;
    }
    return await this.create({ name }, user);
  }
  async findInsterestingTags(user: number): Promise<Tag[]> {
    // randomnly find 10 tags
    return this.tagRepository
      .createQueryBuilder('news_taggit')
      .select()
      .orderBy('RANDOM()')
      .take(10)
      .getMany();
  }
}

@Injectable()
export class NewsTaggitService {
  constructor(
    @InjectRepository(NewsTaggit)
    private newsTaggitRepository: Repository<NewsTaggit>,
    private tagService: TagsService,
    @Inject(forwardRef(() => NewsService))
    private newsService: NewsService,
  ) {}

  async create(
    createNewsTaggitInput: CreateNewsTaggitInput,
    user: number,
  ): Promise<NewsTaggit> {
    let newInputData: any = {
      ...createNewsTaggitInput,
    };

    if (createNewsTaggitInput.news) {
      try {
        const news: News | NotFoundException = await this.newsService.findOne(
          createNewsTaggitInput.news,
        );
        newInputData = {
          ...newInputData,
          news: news,
        };
      } catch (error) {
        throw new NotFoundException('News not found');
      }
    }
    if (createNewsTaggitInput.tag) {
      const tag: Tag = await this.tagService.findOneById(
        createNewsTaggitInput.tag,
      );
      newInputData = {
        ...newInputData,
        tag: tag,
      };
    }

    return this.newsTaggitRepository.save({
      ...newInputData,
    });
  }

  async findAll(): Promise<NewsTaggit[]> {
    return this.newsTaggitRepository.find({
      relations: {
        tag: true,
        news: true,
      },
    });
  }

  async findAllByNews(newsId: number): Promise<NewsTaggit[]> {
    return this.newsTaggitRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: {
        tag: true,
        news: true,
      },
    });
  }

  async findOneByTagAndNews(
    tagId: number,
    newsId: number,
  ): Promise<NewsTaggit> {
    return await this.newsTaggitRepository.findOne({
      where: {
        tag: {
          id: tagId,
        },
        news: {
          id: newsId,
        },
      },
      relations: {
        tag: true,
        news: true,
      },
    });
  }

  async findOne(id: number) {
    const newsTaggit = await this.newsTaggitRepository.findOne({
      where: { id },
      relations: {
        tag: true,
        news: true,
      },
    });
    if (!newsTaggit) {
      throw new NotFoundException(`NewsTaggit with id ${id} not found`);
    }
    return newsTaggit;
  }

  async findOneOrCreate(tag: Tag, news: News, user): Promise<NewsTaggit> {
    const newsTaggit = await this.findOneByTagAndNews(tag.id, news.id);
    if (newsTaggit) {
      return newsTaggit;
    }
    return this.create(
      {
        tag: tag.id,
        news: news.id,
      },
      user,
    );
  }

  async remove(id: number) {
    const newsTaggit: NewsTaggit = await this.findOne(id);
    if (newsTaggit) {
      await this.newsTaggitRepository.delete(id);
      return newsTaggit;
    }
  }
}
