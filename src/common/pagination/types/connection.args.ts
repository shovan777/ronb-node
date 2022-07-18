import { ArgsType, Field } from '@nestjs/graphql';
import {
  ConnectionArguments,
  ConnectionCursor,
  fromGlobalId,
} from 'graphql-relay';

type PagingMeta =
  | { pagingType: 'forward'; after?: string; first: number }
  | { pagingType: 'backward'; before?: string; last: number }
  | { pagingType: 'none' };

function checkPagingSanity(args: ConnectionArgs): PagingMeta {
  const { first = 0, last = 0, after, before } = args;

  const isForwardPaging = !!first || !!after;
  const isBackwardPaging = !!last || !!before;
  if (isForwardPaging && isBackwardPaging) {
    throw new Error("Relay Pagination can't be forwards and backwards!");
  }
  if ((isForwardPaging && before) || (isBackwardPaging && after)) {
    throw new Error(
      'Relay Pagination must be either first/after or last/before!',
    );
  }
  if ((isForwardPaging && first < 0) || (isBackwardPaging && last < 0)) {
    throw new Error('Relay Pagination must be positive!');
  }
  if (last && !before) {
    throw new Error(
      "When pagin backwards, a 'before' cursor must be provided!",
    );
  }

  return isForwardPaging
    ? { pagingType: 'forward', after, first }
    : isBackwardPaging
    ? { pagingType: 'backward', before, last }
    : { pagingType: 'none' };
}

const getId = (cursor: ConnectionCursor) =>
  parseInt(fromGlobalId(cursor).id, 10);
const nextId = (cursor: ConnectionCursor) => getId(cursor) + 1;

function getPagingParameters(args: ConnectionArgs) {
  const meta = checkPagingSanity(args);

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first,
        offset: meta.after ? nextId(meta.after) : 0,
      };
    }
    case 'backward': {
      const { last, before } = meta;
      let limit = last;
      let offset = getId(before) - last;

      if (offset < 0) {
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return { offset, limit };
    }

    default:
      return {};
  }
}

@ArgsType()
export default class ConnectionArgs implements ConnectionArguments {
  @Field({ nullable: true, description: 'Paginate after cursor' })
  public after?: ConnectionCursor;

  @Field({ nullable: true, description: 'Paginate before cursor' })
  public before?: ConnectionCursor;

  @Field({ nullable: true, description: 'Paginate first' })
  public first?: number;

  @Field({ nullable: true, description: 'Paginate last' })
  public last?: number;

  pagingParams() {
    return getPagingParameters(this);
  }
}
