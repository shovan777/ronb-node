import { InputType, Int, Field } from '@nestjs/graphql';
import { UserReacts } from '../../common/entities/base.entity';
import { Upload } from '../../common/scalars/upload.scalar';
import { NewsTaggit, Tag } from '../../tags/entities/tag.entity';
import { NewsCategory, NewsLanguage, NewsState } from '../entities/news.entity';

// import GraphQLUpload from 'graphql-upload';

// registerEnumType(NewsState, {
//   name: 'NewsState',
// });

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
  @Field(() => NewsState, { description: 'News Status', nullable: true })
  state?: NewsState;
  @Field(() => NewsLanguage, { description: 'News Language', nullable: false })
  language?: NewsLanguage;
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

  @Field(() => UserReacts, {
    description: 'User reaction to news',
    nullable: true,
  })
  react?: UserReacts;
}

@InputType()
export class CreateUserInterestsInput {
  @Field(() => [Int], {
    description: 'News tags interesting to the user',
    nullable: true,
  })
  newsTags: number[];

  @Field(() => [Int], {
    description: 'News categories interesting to the user',
    nullable: true,
  })
  newsCategories: number[];
}

@InputType()
export class CreateNewsEngagementInput {
  @Field(() => Int, { description: 'News engaged by the user' })
  newsId: number;

  @Field(() => Date, { description: 'News engagement date' })
  engagmentDate: Date;

  @Field({ description: 'News engagement duration' })
  engagementDuration: string;
}
