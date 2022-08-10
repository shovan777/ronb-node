import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNewsCommentInput {
  @Field(() => Int, { description: 'News id' })
  news: number;
  @Field({ description: 'Comment content' })
  content: string;
}

@InputType()
export class CreateNewsReplyInput {
  @Field(() => Int, { description: 'News comment id' })
  comment: number;
  @Field({ description: 'Comment content' })
  content: string;
  @Field(() => Int, { description: 'User who is replied to by this comment' })
  repliedTo: number;
}
