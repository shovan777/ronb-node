import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  YellowPagesAddress,
  District,
  Province,
  YellowPagesPhoneNumber,
  YellowPages,
  YellowPagesCatgory,
} from '../entities/yellow-pages.entity';
import { CreateYellowPagesInput } from './create-yellow-pages.input';

@InputType()
export class UpdateYellowPagesInput {
  @Field({ description: 'Yellow Pages name' , nullable:true})
  name?: string;

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
export class UpdateYellowPagesAddressInput {
  @Field(() => District, { description: 'District Type', nullable: true })
  district?: District;

  @Field(() => Province, { description: 'Province Type', nullable: true })
  province?: Province;

  @Field(() => Int, { description: 'Yellow pages id', nullable: true })
  yellowpages?: number;
}

@InputType()
export class UpdateYellowPagesPhoneNumberInput {
  @Field({ description: 'Phone number', nullable: true })
  phone_number?: number;

  @Field({ description: '', nullable: true })
  is_emergency?: boolean;

  @Field(() => Int, { description: 'Yellow pages id', nullable: true })
  yellowpages?: number;
}

@InputType()
export class UpdateYellowPagesCategoryInput {
  @Field({ description: 'Yellow Pages name' })
  name?: string;
}
