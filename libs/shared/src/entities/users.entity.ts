import { Field, Int, ObjectType } from '@nestjs/graphql';
import { pathFinderMiddleware } from '../common/middlewares/pathfinder.middleware';

@ObjectType({ description: 'Profile of the user' })
export class Profile {
  @Field(() => Int, { description: 'Profile id' })
  id: number;

  @Field(() => String, { description: 'User Blood Group', nullable: true })
  bloodGroup?: string;

  @Field(() => Boolean, {
    description: 'Has user approved for blood donation or not',
  })
  bloodGroupApproval: true;

  @Field(() => Int, { description: 'Age of the user' })
  age: number;

  @Field(() => String, {
    description: 'Date of birth of the user',
    nullable: true,
  })
  dateOfBirth?: string;

  @Field(() => String, {
    description: 'Phone number for blood profile',
    nullable: true,
  })
  bloodProfileNumber: string;

  @Field(() => String, {
    description: 'Url of the profile picture',
    nullable: true,
    middleware: [pathFinderMiddleware],
  })
  image?: string;

  @Field(() => Int, { nullable: true })
  totalDonation?: number;

  @Field(() => Int, { nullable: true })
  totalAccepted?: number;
}

@ObjectType({ description: 'Address of the user' })
export class UserAddress {
  @Field(() => String)
  province: string;

  @Field(() => String)
  district: string;
}

@ObjectType({ description: 'Comment Author' })
export class Author {
  @Field(() => Int, { description: 'User id' })
  id: number;

  @Field(() => String, { description: 'Username' })
  username: string;

  @Field({ description: 'User name', nullable: true })
  name?: string;

  @Field({ nullable: true })
  first_name: string;

  @Field({ nullable: true })
  last_name: string;

  @Field({ description: 'User email', nullable: true })
  email?: string;

  // @Field({ description: 'User lastname' })
  // lastName: string;
  @Field(() => UserAddress, {
    description: 'User address information',
    nullable: true,
  })
  address: UserAddress;

  @Field(() => Profile, {
    description: 'User profile information',
    nullable: true,
  })
  profile: Profile;
}
