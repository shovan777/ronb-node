import { Field, InputType, Int } from '@nestjs/graphql';
import {
  BloodRequestState,
  BloodRequestStateType,
} from '@app/shared/entities/blood-bank.entity';
import { BigIntResolver } from 'graphql-scalars';
import { BloodGroup } from '@app/shared/common/enum/bloodGroup.enum';
import {
  ArrayUnique,
  IsArray,
  Max,
  Min,
  MaxDate,
} from 'class-validator';
import { getMaxDate, getMinDate } from '@app/shared/common/utils/utils';

@InputType()
export class CreateBloodRequestAddressInput {
  @Field(() => Int, { description: 'District Type' })
  district: number;

  @Field(() => Int, { description: 'Province Type' })
  province: number;

  @Field({ description: 'Address' })
  address: string;
}

@InputType()
export class CreateBloodRequestInput {
  @Field(() => BloodGroup, {
    description: 'Blood group type',
  })
  bloodGroup: BloodGroup;

  @Field(() => Int, {
    description: 'Amount of blood',
    nullable: true,
  })
  @Min(1, { message: 'Amount should be greater than 0' })
  @Max(9, { message: 'Amount should be less than 10' })
  amount: number;

  @Field({
    description: 'Description for blood request',
    nullable: true,
  })
  description?: string;

  @Field(() => BigIntResolver, { description: 'Phone number', nullable: true })
  phoneNumber: number;

  @Field(() => BloodRequestState, {
    description: 'Yellow Pages State',
    nullable: true,
  })
  state?: BloodRequestStateType;

  @Field({
    description: 'Is the blood request an emergency?',
    defaultValue: false,
  })
  is_emergency: boolean;

  @Field(() => CreateBloodRequestAddressInput, {
    description: 'Address for yellow page address',
    nullable: true,
  })
  address?: CreateBloodRequestAddressInput;

  @Field({ description: 'Donation date', nullable: true })
  @MaxDate(getMaxDate())
  donationDate: Date;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayUnique()
  acceptors?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayUnique()
  doners?: number[];
}
