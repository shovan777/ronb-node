import { forwardRef, Module } from '@nestjs/common';
import { NewsTaggitService, TagsService } from './tags.service';
import { NewsTaggitResolver, TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsTaggit, Tag } from '@app/shared/entities/tags.entity';
import { NewsModule } from '../news/news.module';

@Module({
  providers: [TagsResolver, TagsService, NewsTaggitResolver, NewsTaggitService],
  imports: [
    forwardRef(() => NewsModule),
    TypeOrmModule.forFeature([Tag, NewsTaggit]),
  ],
  exports: [TagsService, NewsTaggitService],
})
export class TagsModule {}
