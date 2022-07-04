import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class News {
  @Field(() => Int, { description: 'id field for int' })
  id: number;
  @Field({ description: 'News name' })
  name: string;
  @Field({ description: 'News title', nullable: true })
  title?: string;
  @Field({ description: 'News publishedAt', nullable: true })
  publishedAt: Date;
  @Field({ description: 'News createdAt' })
  createdAt: Date;
  @Field({ description: 'News updatedAt' })
  updatedAt: Date;
  @Field(() => Int, { description: 'News createdBy' })
  createdBy: number;
  @Field(() => Int, { description: 'News updatedBy' })
  updatedBy: number;
  @Field({ description: 'News content' })
  content: string;
  @Field(() => [String], { description: 'News image', nullable: true })
  images?: string[];
  @Field({ description: 'News category', nullable: true })
  category?: number;
  @Field(() => [String], { description: 'News tags', nullable: true })
  tags?: string[];
  @Field({ description: 'News link', nullable: true })
  link?: string;
  @Field({ description: 'News source', nullable: true })
  source?: string;
}
