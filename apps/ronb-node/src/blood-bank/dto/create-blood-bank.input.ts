import { Field, InputType, Int } from '@nestjs/graphql';
import { PublishState as BloodBankState } from '@app/shared/common/enum/publish_state.enum';
import { BigIntResolver } from 'graphql-scalars';
import { BloodGroup } from '@app/shared/common/enum/bloodGroup.enum';
import { ArrayUnique, IsArray } from 'class-validator';

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
  amount: number;

  // @Field({
  //   description: 'Description for blood request',
  //   nullable: true,
  // })
  // description?: string;

  @Field(() => BigIntResolver, { description: 'Phone number', nullable: true })
  phoneNumber: number;

  @Field(() => BloodBankState, {
    description: 'Yellow Pages State',
    nullable: true,
  })
  state?: BloodBankState;

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
