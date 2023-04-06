import {
  ObjectType,
  Field,
  Int,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { NewsComment } from '@app/shared/entities/comment.entity';
import { CreatorBaseEntity } from '@app/shared/common/entities/base.entity';
import { pathFinderMiddleware } from '@app/shared/common/middlewares/pathfinder.middleware';
import { NewsTaggit, Tag } from '@app/shared/entities/tags.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  // @Field(() => [UserInterests], { description: 'User interests' })
  @ManyToMany(
    () => UserInterests,
    (userInterests) => userInterests.newsCategories,
  )
  userInterests: UserInterests[];
}

export enum NewsState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REVIEWED = 'reviewed',
}

registerEnumType(NewsState, {
  name: 'NewsState',
});

export enum NewsLanguage {
  NEPALI = 'nepali',
  ENGLISH = 'english',
}

registerEnumType(NewsLanguage, {
  name: 'NewsLanguage',
});

@ObjectType()
@Entity()
export class News {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  // @Field({ description: 'News name' })
  // @Column()
  // name: string;

  @Field({ description: 'News title' })
  @Column()
  title: string;

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

  @Field(() => NewsCategory, { description: 'News category', nullable: true })
  @ManyToOne(() => NewsCategory, (category) => category.news, {
    nullable: true,
  })
  category?: NewsCategory;

  // tags?: string[];
  @Field(() => [NewsTaggit], { description: 'News tags', nullable: true })
  @OneToMany(() => NewsTaggit, (newsTaggit) => newsTaggit.news, {
    nullable: true,
  })
  tags?: NewsTaggit[];

  @Field({ description: 'News link', nullable: true })
  @Column({ nullable: true })
  link?: string;

  @Field({ description: 'News source', nullable: true })
  @Column({ nullable: true, default: 'RONB' })
  source?: string;

  @Field({ description: 'News Image source', nullable: true })
  @Column({ nullable: true })
  imgSource?: string;

  @Field({ description: 'Is news pinned?' })
  @Column({ default: false })
  pinned: boolean;

  @Field(() => NewsState, { description: 'News state' })
  @Column({ type: 'enum', enum: NewsState, default: NewsState.DRAFT })
  state: NewsState;

  // @Field(() => [UserLikesNews], { description: 'News likes', nullable: true })
  @OneToMany(() => UserLikesNews, (likes) => likes.news, {
    nullable: true,
  })
  likes?: UserLikesNews[];

  // @Field(() => [NewsComment], { description: 'News comments', nullable: true })
  @OneToMany(() => NewsComment, (comment) => comment.news, {
    nullable: true,
  })
  comments?: Comment[];

  @Field(() => UserLikesNews, {
    description: 'React of user to the news',
    nullable: true,
  })
  like?: UserLikesNews | any;

  @OneToMany(() => UserNewsEngagement, (engagements) => engagements.news, {
    nullable: true,
  })
  engagements?: UserNewsEngagement | any;

  @Field(() => NewsLanguage, { description: 'News language' })
  @Column({ type: 'enum', enum: NewsLanguage, default: NewsLanguage.NEPALI })
  language: NewsLanguage;
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

  @Field({ description: 'News image', middleware: [pathFinderMiddleware] })
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

@ObjectType()
@Entity()
export class UserLikesNews {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryColumn({ type: 'int', nullable: false })
  userId: number;

  @PrimaryColumn()
  newsId: number;

  @Field(() => News, { description: 'likes for the news' })
  // @PrimaryColumn({ type: 'int', name: 'newsId' })
  @JoinColumn({ name: 'newsId' })
  @ManyToOne(() => News, (news) => news.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public news: News;
}

@ObjectType()
@Entity()
export class UserNewsEngagement {
  @Field(() => Int, { description: 'id field for user' })
  @PrimaryColumn({ type: 'int', nullable: false })
  userId: number;

  @PrimaryColumn()
  newsId: number;

  @Field(() => News, { description: 'news user is engaged to' })
  @JoinColumn({ name: 'newsId' })
  @ManyToOne(() => News, (news) => news.engagements, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public news: News;

  @Field(() => Date, { description: 'Engagement date' })
  @Column({ type: 'timestamptz', nullable: true })
  engagmentDate: Date;

  @Field(() => String, {
    description: 'Engagement duration in seconds',
    nullable: true,
  })
  @Column({
    type: 'time',
    nullable: true,
  })
  engagementDuration?: string;
}

@ObjectType()
@Entity()
export class UserInterests {
  // stores the news tags that are of interest to the user
  @Field(() => Int, { description: 'id field for user' })
  @PrimaryColumn({ type: 'int', nullable: false })
  userId: number;

  // relation to tags
  @Field(() => [Tag], {
    description: 'News tags of interest to user',
    nullable: true,
  })
  @ManyToMany(() => Tag, (tag) => tag.userInterests, {
    nullable: true,
  })
  @JoinTable()
  newsTags?: Tag[];

  // relation to categories
  @Field(() => [NewsCategory], {
    description: 'News categories of interest to user',
    nullable: true,
  })
  @ManyToMany(() => NewsCategory, (category) => category.userInterests, {
    nullable: true,
  })
  @JoinTable()
  newsCategories?: NewsCategory[];
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

@ObjectType()
export class RecommendationData {
  @Field({ description: 'Url of the user data file' })
  userData: string;

  @Field({ description: 'Url of the news data file' })
  newsData: string;

  @Field({ description: 'Url of the rating data file' })
  ratingData: string;
}
