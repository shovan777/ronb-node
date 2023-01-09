import { InputType, PickType, PartialType } from '@nestjs/graphql';
import { CreateNewsInput } from './create-news.input';

@InputType()
export class FilterNewsInput extends PartialType(PickType(CreateNewsInput, ['category','title'])) {}
