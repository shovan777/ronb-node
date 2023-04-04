import { ObjectType } from '@nestjs/graphql';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { NewsComment, NewsReply } from '@app/shared/entities/comment.entity';

@ObjectType()
export default class CommentsResponse extends relayTypes<NewsComment>(
  NewsComment,
) {}

@ObjectType()
export class RepliesResponse extends relayTypes<NewsReply>(NewsReply) {}
