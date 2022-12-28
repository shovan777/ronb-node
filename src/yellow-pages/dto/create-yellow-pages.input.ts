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
    description: 'Yellow Pages address(s)',
    nullable: true,
  })
  address?: YellowPagesAddress[];

  @Field(() => Int, {
    description: 'Yellow Pages phone number(s)',
    nullable: true,
  })
  phone_number?: YellowPagesPhoneNumber[];

  @Field(() => Int, {
    description: 'Yellow Pages category',
    nullable: true,
  })
  category?: number;
}

@InputType()
export class CreateYellowPagesAddressInput {
  @Field(() => District, { description: 'District Type' })
  district: District;

  @Field(() => Province, { description: 'Province Type' })
  province: Province;

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
