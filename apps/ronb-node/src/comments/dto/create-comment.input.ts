import { InputType, Int, Field } from '@nestjs/graphql';
import { UserReacts } from '@app/shared/common/entities/base.entity';

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

@InputType()
export class CreateUserLikesNewsCommentInput {
  @Field(() => Int, { description: 'News comment liked by the user' })
  commentId: number;

  @Field(() => UserReacts, {
    description: 'User reaction to comment',
    nullable: true,
  })
  react?: UserReacts;
}

@InputType()
export class CreateUserLikesNewsReplyInput {
  @Field(() => Int, { description: 'News reply liked by the user' })
  replyId: number;

  @Field(() => UserReacts, {
    description: 'User reaction to reply',
    nullable: true,
  })
  react?: UserReacts;
}
