import {
  CreateNewsCommentInput,
  CreateNewsReplyInput,
  CreateUserLikesNewsCommentInput,
  CreateUserLikesNewsReplyInput,
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

@InputType()
export class UpdateUserLikesNewsCommentInput extends PickType(
  CreateUserLikesNewsCommentInput,
  ['react'],
) {}

@InputType()
export class UpdateUserLikesNewsReplyInput extends PickType(
  CreateUserLikesNewsReplyInput,
  ['react'],
) {}
