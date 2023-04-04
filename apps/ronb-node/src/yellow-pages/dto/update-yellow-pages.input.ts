import { InputType, PartialType } from '@nestjs/graphql';
import {
  CreateDistrictInput,
  CreateProvinceInput,
  CreateYellowPagesAddressInput,
  CreateYellowPagesCategoryInput,
  CreateYellowPagesEmailInput,
  CreateYellowPagesInput,
  CreateYellowPagesPhoneNumberInput,
} from './create-yellow-pages.input';

@InputType()
export class UpdateYellowPagesInput extends PartialType(
  CreateYellowPagesInput,
) {}
@InputType()
export class UpdateYellowPagesAddressInput extends PartialType(
  CreateYellowPagesAddressInput,
) {}

@InputType()
export class UpdateDistrictInput extends PartialType(CreateDistrictInput) {}

@InputType()
export class UpdateProvinceInput extends PartialType(CreateProvinceInput) {}

@InputType()
export class UpdateYellowPagesPhoneNumberInput extends PartialType(
  CreateYellowPagesPhoneNumberInput,
) {}

@InputType()
export class UpdateYellowPagesEmailInput extends PartialType(
  CreateYellowPagesEmailInput,
) {}

@InputType()
export class UpdateYellowPagesCategoryInput extends PartialType(
  CreateYellowPagesCategoryInput,
) {}
