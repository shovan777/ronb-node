import { ObjectType } from '@nestjs/graphql';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { News } from '@app/shared/entities/news.entity';

@ObjectType()
export default class NewsResponse extends relayTypes<News>(News) {}
