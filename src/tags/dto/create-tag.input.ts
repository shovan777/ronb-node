import { InputType, Int, Field } from '@nestjs/graphql';
import { Tag } from '../entities/tag.entity';

@InputType()
export class CreateTagInput {
  @Field({ description: 'Tag name' })
  name: string;
}

@InputType()
export class CreateNewsTaggitInput{
  @Field(()=>Int, { description: 'News id' })
  news: number;
  
  @Field(()=>Int,{ description: 'Tag id' })
  tag: number;
}