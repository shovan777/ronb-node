import { InputType, PartialType } from '@nestjs/graphql';
import {
  CreateBloodRequestAddressInput,
  CreateBloodRequestInput,
} from './create-blood-bank.input';

@InputType()
export class UpdateBloodRequestInput extends PartialType(
  CreateBloodRequestInput,
) {}

@InputType()
export class UpdateBloodRequestAdressInput extends PartialType(
  CreateBloodRequestAddressInput,
) {}
