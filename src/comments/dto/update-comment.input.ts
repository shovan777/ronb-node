import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
} from './create-comment.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateNewsCommentInput extends PickType(CreateNewsCommentInput, [
  'content',
]) {}

@InputType()
export class UpdateNewsReplyInput extends PickType(CreateNewsReplyInput, [
  'content',
]) {}
