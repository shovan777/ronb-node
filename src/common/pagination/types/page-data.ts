import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class PageData {
  @Field({ description: 'total number of objects' })
  public count: number;

  @Field()
  public limit: number;

  @Field()
  public offset: number;

  @Field({ description: 'current date time', defaultValue: new Date() })
  public curTime: Date;
}
