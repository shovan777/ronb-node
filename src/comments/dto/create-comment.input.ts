import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNewsCommentInput {
  @Field(() => Int, { description: 'News id' })
  news: number;
  @Field({ description: 'Comment content' })
  content: string;
}
