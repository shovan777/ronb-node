import { Field, InputType, Int } from '@nestjs/graphql';
import {
  YellowPagesAddress,
  District,
  Province,
  YellowPagesPhoneNumber,
  YellowPages,
  YellowPagesCatgory,
} from '../entities/yellow-pages.entity';

@InputType()
export class CreateYellowPagesCategoryInput {
  @Field({ description: 'Yellow Pages name' })
  name: string;
}

@InputType()
export class CreateYellowPagesInput {
  @Field({ description: 'Yellow Pages name' })
  name: string;

  @Field(() => Int, {
    description: 'Yellow Pages category',
    nullable: true,
  })
  category?: number;
}

@InputType()
export class CreateYellowPagesAddressInput {
  @Field(() => Int, { description: 'District Type' })
  district: number;

  @Field(() => Int, { description: 'Province Type' })
  province: number;

  @Field(() => Int, { description: 'Yellow pages id' })
  yellowpages?: number;
}

@InputType()
export class CreateYellowPagesPhoneNumberInput {
  @Field({ description: 'Phone number' })
  phone_number: number;

  @Field({ description: '' })
  is_emergency: boolean;

  @Field(() => Int, { description: 'Yellow pages id' })
  yellowpages?: number;
}
