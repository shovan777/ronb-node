import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseIdEntity,
  BaseUserLikesEntity,
  ReactCount,
} from 'src/common/entities/base.entity';
import { pathFinderMiddleware } from 'src/common/middlewares/pathfinder.middleware';
import { News } from 'src/news/entities/news.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  // Tree,
  // TreeChildren,
  // TreeLevelColumn,
  // TreeParent,
} from 'typeorm';

@ObjectType({ isAbstract: true })
// @Entity()
export abstract class BaseComment extends BaseIdEntity {
  @Field({ description: 'Comment content' })
  @Column()
  content: string;

  @Field({ description: 'date of creation' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'date of update' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int, { description: 'one wrote the comment' })
  @Column()
  author: number;

  // @Field(() => ReactCount, { description: 'react counts' })
  // reactCount;
}

@Entity()
// @Tree('closure-table')
@ObjectType()
export class NewsComment extends BaseComment {
  // @Field(() => News, { description: 'Commented news' })
  @ManyToOne(() => News, (news) => news.comments, {
    onDelete: 'CASCADE',
  })
  news: News;

  @Field(() => [NewsReply], { description: 'Replies to this comment' })
  @OneToMany(() => NewsReply, (reply) => reply.comment, {
    nullable: true,
  })
  replies?: NewsReply[];

  @Field(() => Int, { description: 'Number of replies' })
  replyCount: number;

  @OneToMany(() => UserLikesNewsComment, (likes) => likes.comment, {
    nullable: true,
  })
  likes?: UserLikesNewsComment[];

  @Field(() => UserLikesNewsComment, {
    description: 'Reaction of the user to this comment',
    nullable: true,
  })
  like?: UserLikesNewsComment | any;

  // @Field(() => [NewsComment], {
  //   description: 'News comment replies',
  //   nullable: true,
  // })
  // @TreeChildren()
  // children: NewsComment[];

  // @Field(() => NewsComment, {
  //   description: 'Parent comment whose reply is this comment',
  //   nullable: true,
  // })
  // @TreeParent()
  // parent: NewsComment;

  // @TreeLevelColumn()
  // level: number;
}

@Entity()
@ObjectType()
export class NewsReply extends BaseComment {
  // @Field(() => NewsComment, { description: 'Replied comment' })
  @ManyToOne(() => NewsComment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  comment: NewsComment;

  @Field(() => Int, { description: 'User who is replied to' })
  @Column()
  repliedTo: number;

  @OneToMany(() => UserLikesNewsReply, (likes) => likes.reply, {
    nullable: true,
  })
  likes?: UserLikesNewsReply[];

  @Field(() => UserLikesNewsReply, {
    description: 'Reaction of the user to this comment',
    nullable: true,
  })
  like?: UserLikesNewsReply | any;
}

@Entity()
@ObjectType()
export class UserLikesNewsComment extends BaseUserLikesEntity {
  @PrimaryColumn()
  commentId: number;

  // @Field(() => NewsComment, { description: 'likes for the news comment' })
  @JoinColumn({ name: 'commentId' })
  @ManyToOne(() => NewsComment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public comment: NewsComment;
}

@Entity()
@ObjectType()
export class UserLikesNewsReply extends BaseUserLikesEntity {
  @PrimaryColumn()
  replyId: number;

  // @Field(() => NewsComment, { description: 'likes for the news comment' })
  @JoinColumn({ name: 'replyId' })
  @ManyToOne(() => NewsReply, (reply) => reply.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  public reply: NewsReply;
}

@ObjectType({ description: 'Profile of the user' })
export class Profile {
  @Field(() => Int, { description: 'Profile id' })
  id: number;

  @Field(() => String, { description: 'User Blood Group', nullable: true })
  bloodGroup?: string;

  @Field(() => String, {
    description: 'Url of the profile picture',
    nullable: true,
    middleware: [pathFinderMiddleware],
  })
  image?: string;
}

@ObjectType({ description: 'Comment Author' })
export class Author {
  @Field(() => Int, { description: 'User id' })
  id: number;

  @Field({ description: 'User name' })
  name: string;

  // @Field({ description: 'User lastname' })
  // lastName: string;

  @Field(() => Profile, { description: 'User profile information' })
  profile: Profile;
}
