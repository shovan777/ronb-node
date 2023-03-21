import { forwardRef, Module } from '@nestjs/common';
import { PublicToiletService } from './public-toilet.service';
import { PublicToiletResolver } from './public-toilet.resolver';
import { Upload } from '../common/scalars/upload.scalar';
import { GeoJSONPointScalar } from '../common/scalars/geojson/Point.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PublicToilet,
  PublicToiletImage,
} from './entities/public-toilet.entity';
import { ReviewsModule } from '../reviews/reviews.module';
import { FilesService } from '../common/services/files.service';

@Module({
  providers: [
    PublicToiletResolver,
    PublicToiletService,
    Upload,
    GeoJSONPointScalar,
    FilesService,
  ],
  imports: [
    TypeOrmModule.forFeature([PublicToilet, PublicToiletImage]),
    forwardRef(() => ReviewsModule),
  ],
  exports: [PublicToiletService],
})
export class PublicToiletModule {}
