import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/common/pagination/types/relay.types';
import { NewsComment, NewsReply } from './entities/comment.entity';

@ObjectType()
export default class CommentsResponse extends relayTypes<NewsComment>(
  NewsComment,
) {}

@ObjectType()
export class RepliesResponse extends relayTypes<NewsReply>(NewsReply) {}
