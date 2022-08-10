import { CreateNewsCommentInput } from './create-comment.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateNewsCommentInput extends PickType(CreateNewsCommentInput, [
  'content',
]) {}
