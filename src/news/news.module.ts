import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { Upload } from 'src/common/scalars/upload.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News, NewsImage } from './entities/news.entity';

@Module({
  providers: [NewsResolver, NewsService, Upload],
  imports: [TypeOrmModule.forFeature([News, NewsImage])],
})
export class NewsModule {}
