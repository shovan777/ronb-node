import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class News {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'News name' })
  @Column()
  name: string;

  @Field({ description: 'News title', nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ description: 'News publishedAt', nullable: true })
  @Column({ nullable: true })
  publishedAt: Date;

  @Field({ description: 'News createdAt' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'News updatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int, { description: 'News createdBy' })
  @Column()
  createdBy: number;

  @Field(() => Int, { description: 'News updatedBy' })
  @Column()
  updatedBy: number;

  @Field({ description: 'News content' })
  @Column()
  content: string;

  // @Field(() => [String], { description: 'News image', nullable: true })
  @Field(() => [NewsImage], { description: 'News image', nullable: true })
  @OneToMany(() => NewsImage, (newsImage) => newsImage.news, { nullable: true })
  images?: NewsImage[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  singleImage?: string;

  @Field({ description: 'News category', nullable: true })
  @Column({ nullable: true })
  category?: number;

  @Field(() => [String], { description: 'News tags', nullable: true })
  tags?: string[];

  @Field({ description: 'News link', nullable: true })
  @Column({ nullable: true })
  link?: string;

  @Field({ description: 'News source', nullable: true })
  @Column({ nullable: true })
  source?: string;
}

@ObjectType()
@Entity()
export class NewsImage {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => News)
  @ManyToOne(() => News, (news) => news.images)
  news: News;

  @Field({ description: 'News image' })
  @Column()
  imageURL: string;

  // @Field({ description: 'News image name' })
  // @Column()
  // name: string;

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
