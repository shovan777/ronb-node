import { CreateNewsTaggitInput, CreateTagInput } from './create-tag.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTagInput extends PartialType(CreateTagInput) {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdateNewsTaggitInput extends PartialType(CreateNewsTaggitInput) {
  @Field(() => Int)
  id: number;
}