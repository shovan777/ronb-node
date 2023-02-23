import { ObjectType } from '@nestjs/graphql';
import { PaginateAdmin } from 'src/common/pagination/fetch-pagination-response';
import relayTypes from 'src/common/pagination/types/relay.types';
import {
  YellowPages,
  YellowPagesCatgory,
} from './entities/yellow-pages.entity';

@ObjectType()
export class YellowPagesResponse extends relayTypes<YellowPages>(YellowPages) {}

@ObjectType()
export class YellowPagesCategoryResponse extends relayTypes<YellowPagesCatgory>(
  YellowPagesCatgory,
) {}

@ObjectType()
export class YellowPagesAdminResponse extends PaginateAdmin<YellowPages>(
  YellowPages,
) {}
