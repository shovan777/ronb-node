import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/common/pagination/types/relay.types';
import { YellowPages, YellowPagesCatgory } from './entities/yellow-pages.entity';

@ObjectType()
export class YellowPagesResponse extends relayTypes<YellowPages>(
  YellowPages,
) {}

@ObjectType()
export class YellowPagesCategoryResponse extends relayTypes<YellowPagesCatgory>(
    YellowPagesCatgory
){}
