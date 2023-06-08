import { PublishState as YellowPagesState } from '@app/shared/common/enum/publish_state.enum';
import { Field, InputType, PartialType } from '@nestjs/graphql';
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
export class PublishYellowPagesInput {
  @Field(() => YellowPagesState)
  state: YellowPagesState;
}

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
