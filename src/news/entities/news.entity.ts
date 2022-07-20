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

  @Field({ description: 'News main image.', nullable: true })
  @Column({ nullable: true })
  singleImage?: string;

  @ManyToOne(() => NewsCategory, (category) => category.news, {
    nullable: true,
  })
  @Column({ nullable: true })
  category?: number;

  @Field(() => [String], { description: 'News tags', nullable: true })
  tags?: string[];

  @Field({ description: 'News link', nullable: true })
  @Column({ nullable: true })
  link?: string;

  @Field({ description: 'News source', nullable: true })
  @Column({ nullable: true, default: 'RONB' })
  source?: string;

  @Field({ description: 'News Image source', nullable: true })
  @Column({ nullable: true })
  imgSource?: string;
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

@ObjectType({ isAbstract: true })
@Entity()
export abstract class BaseEntity {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;
}

@ObjectType({ isAbstract: true })
@Entity()
export abstract class CreatorBaseEntity extends BaseEntity {
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

@ObjectType()
@Entity()
export class NewsCategory extends CreatorBaseEntity {
  @Field({ description: 'News category name' })
  @Column()
  name: string;

  @Field({ description: 'News category description', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [News], { description: 'News in this category' })
  @OneToMany(() => News, (news) => news.category)
  news: News[];
}

// @Entity()
// export class NewsTag {
//   @Field(() => Int, { description: 'id field for int' })
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field({ description: 'News tag name' })
//   @Column()
//   name: string;

//   @Field({ description: 'News tag createdAt' })
//   @CreateDateColumn()
//   createdAt: Date;

//   @Field({ description: 'News tag updatedAt' })
//   @UpdateDateColumn()
//   updatedAt: Date;

//   @Field(() => Int, { description: 'News tag createdBy' })
//   @Column()
//   createdBy: number;

//   @Field(() => Int, { description: 'News tag updatedBy' })
//   @Column()
//   updatedBy: number;
// }

// @Entity()
// export class NewsSource {
//   @Field(() => Int, { description: 'id field for int' })
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field({ description: 'News source name' })
//   @Column()
//   name: string;

//   @Field({ description: 'News source createdAt' })
//   @CreateDateColumn()
//   createdAt: Date;

//   @Field({ description: 'News source updatedAt' })
//   @UpdateDateColumn()
//   updatedAt: Date;
