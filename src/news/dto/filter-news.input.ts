import { InputType, PickType } from '@nestjs/graphql';
import { CreateNewsInput } from './create-news.input';

@InputType()
export class FilterNewsInput extends PickType(CreateNewsInput, ['category']) {}
