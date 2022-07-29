import { InputType, Int, Field } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';

@InputType()
export class CreateTagInput {
  @Field({ description: 'Tag name' })
  name: string;
}


@InputType()
export class CreateTagItemInput {
  @Field(() => Tag, { description: 'Tag object' })
  tag: Tag;

  @Field(() => Int, { description: 'related entitiy object id'})
  objectId: number;

  @Field(() => String, { description: 'related entitiy object type'})
  objectType: string;
}