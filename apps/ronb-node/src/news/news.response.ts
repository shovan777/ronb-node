import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../common/pagination/types/relay.types';
import { News } from './entities/news.entity';

@ObjectType()
export default class NewsResponse extends relayTypes<News>(News) {}
