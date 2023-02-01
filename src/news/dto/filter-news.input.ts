import { InputType, PickType, PartialType, Field } from '@nestjs/graphql';
import { CreateNewsInput } from './create-news.input';

@InputType()
export class FilterNewsInput extends PartialType(
  PickType(CreateNewsInput, ['category', 'title', 'language']),
) {
  @Field({ description: 'Search query', nullable: true })
  searchQuery?: string;
}
