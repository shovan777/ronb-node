import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "src/common/decorators/user.decorator";
import { checkUserAuthenticated } from "src/common/utils/checkUserAuthentication";
import { CreatePublicToiletReviewInput } from "./dto/create-reviews.input";
import { PublicToiletReview } from "./entities/reviews.entity";
import { PublicToiletReviewsService } from "./reviews.service";


@Resolver(() => PublicToiletReview)
export class PublicToiletReviewsResolver {
    constructor(
        private readonly publicToiletReviewsService: PublicToiletReviewsService,
    ) {}

    @Mutation(() => PublicToiletReview)
    createPublicToiletReview(
        @Args('createPublicToiletReviewsInput')
        createPublicToiletReviewInput: CreatePublicToiletReviewInput,
        @User() user: number,
    ) {
        checkUserAuthenticated(user);
        return this.publicToiletReviewsService.create(createPublicToiletReviewInput, user);
    }
}