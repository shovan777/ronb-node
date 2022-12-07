import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class PageData {
  @Field(() => Int, { description: 'total number of objects' })
  public count: number;

  @Field(() => Int, { description: 'limit of pages' })
  public limit: number;

  @Field(() => Int, { description: 'offset of pages' })
  public offset: number;

  @Field({ description: 'current date time' })
  public curTime: Date;
}
