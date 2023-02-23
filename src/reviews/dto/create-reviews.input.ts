import { Field, InputType, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";

@InputType()
export class CreatePublicToiletReviewInput {
    @Field(() => Int, { description: 'Public Toilet id'})
    publicToilet: number;

    @Field({ description: 'Review content' })
    content: string;

    @Min(0)
    @Max(5)
    @Field(() => Int, { description: 'Review rating' })
    rating: number;
}