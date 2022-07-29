import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from 'src/common/utils/slugify';
import { Repository } from 'typeorm';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';

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

  async findAll(
    limit: number,
    offset: number,
  ): Promise<[Tag[], number]> {
    return this.tagRepository.findAndCount({
      take: limit,
      skip: offset,
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
