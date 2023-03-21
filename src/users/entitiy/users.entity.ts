import { Field, Int, ObjectType } from "@nestjs/graphql";
import { pathFinderMiddleware } from "src/common/middlewares/pathfinder.middleware";

@ObjectType({ description: 'Profile of the user' })
export class Profile {
  @Field(() => Int, { description: 'Profile id' })
  id: number;

  @Field(() => String, { description: 'User Blood Group', nullable: true })
  bloodGroup?: string;

  @Field(() => String, {
    description: 'Url of the profile picture',
    nullable: true,
    middleware: [pathFinderMiddleware],
  })
  image?: string;
}

@ObjectType({ description: 'Comment Author' })
export class Author {
  @Field(() => Int, { description: 'User id' })
  id: number;

  @Field({ description: 'User name' })
  name: string;

  // @Field({ description: 'User lastname' })
  // lastName: string;

  @Field(() => Profile, { description: 'User profile information', nullable:true })
  profile: Profile;
}
