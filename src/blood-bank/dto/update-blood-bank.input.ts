import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBloodRequestInput } from './create-blood-bank.input';

@InputType()
export class UpdateBloodRequestInput extends PartialType(
  CreateBloodRequestInput,
) {}
