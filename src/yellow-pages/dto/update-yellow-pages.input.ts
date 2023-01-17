import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  YellowPagesAddress,
  District,
  Province,
  YellowPagesPhoneNumber,
  YellowPages,
  YellowPagesCatgory,
} from '../entities/yellow-pages.entity';
import { CreateYellowPagesAddressInput, CreateYellowPagesCategoryInput, CreateYellowPagesInput, CreateYellowPagesPhoneNumberInput } from './create-yellow-pages.input';

@InputType()
export class UpdateYellowPagesInput extends PartialType(CreateYellowPagesInput){}
@InputType()
export class UpdateYellowPagesAddressInput extends PartialType(CreateYellowPagesAddressInput){}

@InputType()
export class UpdateYellowPagesPhoneNumberInput extends PartialType(CreateYellowPagesPhoneNumberInput){}

@InputType()
export class UpdateYellowPagesCategoryInput extends PartialType(CreateYellowPagesCategoryInput){}
