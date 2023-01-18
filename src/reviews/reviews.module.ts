import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicToiletModule } from "src/public-toilet/public-toilet.module";
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
        PublicToiletModule
    ]
})
export class ReviewsModule {}