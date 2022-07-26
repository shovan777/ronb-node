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
import { GeoJSONPointScalar } from 'src/common/scalars/geojson/Point.scalar';

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

  @Field({ description: 'Public Toilet main image.', nullable: true })
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

  @Field({ description: 'Public Toilet image' })
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