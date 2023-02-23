import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import {
  CreateDistrictInput,
  CreateYellowPagesAddressInput,
  CreateYellowPagesInput,
} from './create-yellow-pages.input';

@InputType()
export class FilterDistrictInput extends PartialType(
  PickType(CreateDistrictInput, ['province']),
) {}

@InputType()
export class FilterYellowPagesInput extends PartialType(
  PickType(CreateYellowPagesInput, ['category']),
) {
  @Field(() => Int, { nullable: true })
  province?: number;

  @Field(() => Int, { nullable: true })
  district?: number;

  @Field(() => Boolean, { nullable: true })
  is_emergency: boolean;

  @Field(() => String, {
    description: 'Search query for yellow pages',
    nullable: true,
  })
  searchQuery?: string;
}
