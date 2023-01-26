import { InputType, PartialType, PickType } from '@nestjs/graphql';
import {
  CreateDistrictInput,
  CreateYellowPagesInput,
} from './create-yellow-pages.input';

@InputType()
export class FilterDistrictInput extends PartialType(
  PickType(CreateDistrictInput, ['province']),
) {}

@InputType()
export class FilterYellowPagesInput extends PartialType(
  PickType(CreateYellowPagesInput, ['category']),
) {}
