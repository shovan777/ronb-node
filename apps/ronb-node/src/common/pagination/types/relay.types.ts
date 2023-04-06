import * as Relay from 'graphql-relay';
import { ObjectType, Field } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import PageData from './page-data';

const typeMap = {};
export default function relayTypes<T>(type: Type<T>): any {
  const { name } = type;
  if (typeMap[`${name}`]) {
    return typeMap[`${name}`];
  }

  @ObjectType(`${name}Edge`, { isAbstract: true })
  class Edge implements Relay.Edge<T> {
    public name = `${name}Edge`;

    // @Field({ nullable: true })
    @Field(() => String, { nullable: true })
    public cursor!: Relay.ConnectionCursor;

    @Field(() => type, { nullable: true })
    public node!: T;
  }

  @ObjectType(`${name}PageInfo`, { isAbstract: true })
  class PageInfo implements Relay.PageInfo {
    @Field(() => String, { nullable: true })
    public startCursor!: Relay.ConnectionCursor;

    @Field(() => String, { nullable: true })
    public endCursor!: Relay.ConnectionCursor;

    @Field(() => Boolean)
    public hasNextPage!: boolean;

    @Field(() => Boolean)
    public hasPreviousPage!: boolean;
  }

  @ObjectType(`${name}Connection`, { isAbstract: true })
  class Connection implements Relay.Connection<T> {
    public name = `${name}Connection`;
    @Field(() => [Edge])
    public edges!: Relay.Edge<T>[];

    @Field(() => PageInfo)
    public pageInfo!: Relay.PageInfo;
  }

  @ObjectType(`${name}Page`, { isAbstract: true })
  abstract class Page {
    public name = `${name}Page`;

    @Field(() => Connection)
    public page!: Connection;

    @Field(() => PageData, { nullable: true })
    public pageData!: PageData;
  }

  typeMap[`${name}`] = Page;
  return typeMap[`${name}`];
}
