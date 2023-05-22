import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateBloodRequestInput } from './create-blood-bank.input';

@InputType()
export class FilterBloodRequestInput extends PartialType(
  PickType(CreateBloodRequestInput, ['bloodGroup']),
) {}
