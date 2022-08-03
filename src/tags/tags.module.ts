import { forwardRef, Module } from '@nestjs/common';
import { NewsTaggitService, TagsService } from './tags.service';
import { NewsTaggitResolver, TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  NewsTaggit, Tag } from './entities/tag.entity';
import { NewsModule } from 'src/news/news.module';

@Module({
  providers: [
    TagsResolver, 
    TagsService, 
    NewsTaggitResolver, 
    NewsTaggitService,
  ],
  imports: [
    forwardRef(() => NewsModule),
    TypeOrmModule.forFeature([Tag, NewsTaggit]),
  ],
  exports: [
    TagsService,
    NewsTaggitService,
  ],
})
export class TagsModule {}
