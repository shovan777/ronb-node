import { InputType, PickType } from "@nestjs/graphql";
import { CreatePublicToiletReviewInput } from "./create-reviews.input";

@InputType()
export class UpdatePublicToiletReviewInput extends PickType(
    CreatePublicToiletReviewInput,
    ['content','rating'],
) {}