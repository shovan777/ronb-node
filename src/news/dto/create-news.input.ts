import { InputType, Int, Field } from '@nestjs/graphql';
import { Upload } from 'src/common/scalars/upload.scalar';
import { NewsState } from '../entities/news.entity';
// import GraphQLUpload from 'graphql-upload';

@InputType()
export class CreateNewsInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  // @Field({ description: 'News name' })
  // name: string;
  @Field({ description: 'News title' })
  title: string;
  // @Field({ description: 'News publish date' })
  @Field({ description: 'News content' })
  content: string;
  @Field(() => [Upload], { description: 'News image', nullable: true })
  images?: Upload[];
  @Field({ nullable: true })
  singleImage?: Upload;
  @Field(() => Int, { description: 'News category', nullable: true })
  category?: number;
  @Field(() => [String], { description: 'News tags', nullable: true })
  tags?: string[];
  @Field({ description: 'News link', nullable: true })
  link?: string;
  @Field({ description: 'News source', nullable: true })
  source?: string;
  @Field({ description: 'News Image source', nullable: true })
  imgSource?: string;
  @Field({ description: 'Is news pinned?', nullable: true })
  pinned?: boolean;
  @Field({ description: 'News Status', nullable: true })
  state?: NewsState;
}

@InputType()
export class CreateNewsCategoryInput {
  @Field({ description: 'News category name' })
  name: string;
  @Field({ description: 'News category description', nullable: true })
  description?: string;
}

@InputType()
export class CreateUserLikesNewsInput {
  @Field(() => Int, { description: 'News liked by the user' })
  newsId: number;
}
