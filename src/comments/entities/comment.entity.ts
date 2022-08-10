import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseIdEntity } from 'src/common/entities/base.entity';
import { News } from 'src/news/entities/news.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
}
