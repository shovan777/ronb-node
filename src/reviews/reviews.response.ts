import { ObjectType } from "@nestjs/graphql";
import relayTypes from "src/common/pagination/types/relay.types";
import { PublicToiletReview } from "./entities/reviews.entity";

@ObjectType()
export default class PublicToiletReviewsResponse extends relayTypes<PublicToiletReview>(
    PublicToiletReview,
) {}
