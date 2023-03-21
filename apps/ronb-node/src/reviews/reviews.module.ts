import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicToiletModule } from "../public-toilet/public-toilet.module";
import { UsersModule } from "../users/users.module";
import { PublicToiletReview } from "./entities/reviews.entity";
import { PublicToiletReviewsResolver } from "./reviews.resolver";
import { PublicToiletReviewsService } from "./reviews.service";

@Module({
    providers: [
        PublicToiletReviewsService,
        PublicToiletReviewsResolver,
    ],
    imports: [
        TypeOrmModule.forFeature([PublicToiletReview]),
        forwardRef(() => PublicToiletModule),
        UsersModule,
    ],
    exports: [PublicToiletReviewsService,],
})
export class ReviewsModule {}