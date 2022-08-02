import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from 'src/common/utils/slugify';
import { News } from 'src/news/entities/news.entity';
import { Repository } from 'typeorm';
import { CreateTagInput, CreateNewsTaggitInput } from './dto/create-tag.input';
import { NewsTaggit, Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
   ) {}
  
  async create(createTagInput: CreateTagInput): Promise<Tag> {
    const slug = slugify(createTagInput.name);
    return this.tagRepository.save({
      ...createTagInput,
      slug,
      createdBy:1,
      updatedBy:1,
    });
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}


@Injectable()
export class NewsTaggitService {
  constructor(
    @InjectRepository(NewsTaggit)
    private newsTaggitRepository: Repository<NewsTaggit>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
   ) {}
  
  async create(createNewsTaggitInput: CreateNewsTaggitInput): Promise<NewsTaggit> {
    let newInputData: any = {
      ...createNewsTaggitInput,
    }
    
    if (createNewsTaggitInput.news) {
      const news: News = await this.newsRepository.findOneBy({
        id: createNewsTaggitInput.news,
      });
      if (!news) {
        throw new NotFoundException(`News with id ${createNewsTaggitInput.news} not found`);
      }
      newInputData = {
        ...newInputData,
        news: news,
      };
    }
    if (createNewsTaggitInput.tag) {
      const tag: Tag = await this.tagRepository.findOneBy({
        id: createNewsTaggitInput.tag,
      });
      if (!tag) {
        throw new NotFoundException(`Tag with id ${createNewsTaggitInput.tag} not found`);
      }
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
      relations:{
        tag:true,
        news:true,
      },
    });
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} tag`;
  // }

  // update(id: number, updateTagInput: UpdateTagInput) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
