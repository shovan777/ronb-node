import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Point} from 'geojson';
import { pathFinderMiddleware } from 'src/common/middlewares/pathfinder.middleware';
import { GeoJSONPointScalar } from 'src/common/scalars/geojson/Point.scalar';
import { PublicToiletReview } from 'src/reviews/entities/reviews.entity';
import { PublishState as PublicToiletState } from 'src/common/enum/publish_state.enum';

@ObjectType()
@Entity()
export class PublicToilet {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Public Toilet name' })
  @Column()
  name: string;

  @Field({ description: 'Public Toilet publishedAt', nullable: true })
  @Column({ nullable: true })
  publishedAt: Date;

  @Field({ description: 'Public Toilet createdAt' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Public Toilet updatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int, { description: 'Public Toilet createdBy' })
  @Column()
  createdBy: number;

  @Field(() => Int, { description: 'Public Toilet updatedBy' })
  @Column()
  updatedBy: number;

  @Field({ description: 'Public Toilet content' })
  @Column()
  content: string;

  @Field({ description: 'Public Toilet Address' })
  @Column()
  address: string;

  @Field({ description: 'Public Toilet main image.', nullable: true, middleware: [pathFinderMiddleware]  })
  @Column({ nullable: true })
  singleImage?: string;
  
  @Field(() => GeoJSONPointScalar,{ description: 'Public Toilet Location'})
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geopoint: Point;
  
  @Field(() => [PublicToiletImage], { description: 'Public Toilet image', nullable: true })
  @OneToMany(() => PublicToiletImage, (publicToiletImage) => publicToiletImage.publicToilet, { nullable: true })
  images?: PublicToiletImage[];

  @Field(() => [PublicToiletReview], { description: 'Public Toilet Review', nullable: true })
  @OneToMany(() => PublicToiletReview, (review) => review.publicToilet, {
    nullable: true,
  })
  review?: PublicToiletReview[];

  @Field(() => PublicToiletState, { description: 'Public Toilet state' })
  @Column({
    type: 'enum',
    enum: PublicToiletState,
    default: PublicToiletState.DRAFT,
  })
  state: PublicToiletState;
}


@ObjectType()
@Entity()
export class PublicToiletImage {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => PublicToilet)
  @ManyToOne(() => PublicToilet, (publicToilet) => publicToilet.images)
  publicToilet: PublicToilet;

  @Field({ description: 'Public Toilet image', middleware: [pathFinderMiddleware] })
  @Column()
  image: string;

  @Field({ description: 'News image createdAt' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'News image updatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int, { description: 'News image createdBy' })
  @Column()
  createdBy: number;

  @Field(() => Int, { description: 'News image updatedBy' })
  @Column()
  updatedBy: number;
}