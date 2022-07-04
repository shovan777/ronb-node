import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNewsInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field({ description: 'News name' })
  name: string;
  @Field({ description: 'News title', nullable: true })
  title?: string;
  // @Field({ description: 'News publish date' })
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
