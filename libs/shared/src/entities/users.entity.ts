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

  @Field(() => String, { description: 'Date of birth of the user' })
  dateOfBirth?: string;

  @Field(() => String, {
    description: 'Url of the profile picture',
    nullable: true,
    middleware: [pathFinderMiddleware],
  })
  image?: string;

  @Field(() => Int, {nullable:true})
  totalDonation?: number;

  @Field(() => Int, {nullable:true})
  totalAccepted?: number;
}

@ObjectType({ description: 'Comment Author' })
export class Author {
  @Field(() => Int, { description: 'User id' })
  id: number;

  @Field(() => String, { description: 'Username' })
  username: string;

  @Field({ description: 'User name' })
  name: string;

  @Field({ description:'User email'})
  email?: string;

  // @Field({ description: 'User lastname' })
  // lastName: string;

  @Field(() => Profile, {
    description: 'User profile information',
    nullable: true,
  })
  profile: Profile;
}
