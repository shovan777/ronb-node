import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/common/pagination/types/relay.types';
import { NewsComment } from './entities/comment.entity';

@ObjectType()
export default class CommentsResponse extends relayTypes<NewsComment>(
  NewsComment,
) {}
