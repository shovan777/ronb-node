import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PublicToiletService } from "src/public-toilet/public-toilet.service";
import { Repository } from "typeorm";
import { CreatePublicToiletReviewInput } from "./dto/create-reviews.input";
import { PublicToiletReview } from "./entities/reviews.entity";

@Injectable()
export class PublicToiletReviewsService {
    constructor(
        @InjectRepository(PublicToiletReview)
        private publicToiletRepository: Repository<PublicToiletReview>,
        private readonly publicToiletService: PublicToiletService,
    ) {}

    async create(
        createPublicToiletReviewInput: CreatePublicToiletReviewInput,
        user: number,
    ): Promise<PublicToiletReview> {
        let reviewInputData: any = {
            ...createPublicToiletReviewInput
        };

        const publicToilet = await this.publicToiletService.findOne(createPublicToiletReviewInput.publicToilet);
        reviewInputData = {
            ...reviewInputData,
            publicToilet: publicToilet,
        };

        
        return this.publicToiletRepository.save({
            ...reviewInputData,
            author: user,
        })
    }
}