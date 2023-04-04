import { ObjectType } from '@nestjs/graphql';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { PublicToiletReview } from '@app/shared/entities/reviews.entity';

@ObjectType()
export default class PublicToiletReviewsResponse extends relayTypes<PublicToiletReview>(
  PublicToiletReview,
) {}
