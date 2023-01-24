import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateDistrictInput } from './create-yellow-pages.input';

@InputType()
export class FilterDistrictInput extends PartialType(
  PickType(CreateDistrictInput, ['province']),
) {}
