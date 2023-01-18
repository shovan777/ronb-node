import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreatePublicToiletReviewInput {
    @Field(() => Int, { description: 'Public Toilet id'})
    publicToilet: number;

    @Field({ description: 'Review content' })
    content: string;

    @Field(() => Int, { description: 'Review rating', nullable:true })
    rating: number;
}