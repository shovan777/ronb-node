import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PublicToiletService } from "src/public-toilet/public-toilet.service";
import { Repository } from "typeorm";
import { CreatePublicToiletReviewInput } from "./dto/create-reviews.input";
import { UpdatePublicToiletReviewInput } from "./dto/update-reviews.input";
import { PublicToiletReview } from "./entities/reviews.entity";
import { checkUserIsAuthor } from 'src/common/utils/checkUserAuthentication';


@Injectable()
export class PublicToiletReviewsService {
    constructor(
        @InjectRepository(PublicToiletReview)
        private publicToiletReviewRepository: Repository<PublicToiletReview>,
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

        
        return this.publicToiletReviewRepository.save({
            ...reviewInputData,
            author: user,
        })
    }

    async findAll(
        publicToiletId: number,
        limit: number, 
        offset: number,
    ): Promise<[PublicToiletReview[], number]> {
        return this.publicToiletReviewRepository.findAndCount({
            where: {
                publicToilet:{id:publicToiletId},
            },
            take: limit,
            skip:offset,
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: number) {
        const publicToiletReview = await this.publicToiletReviewRepository.findOne({
            where: {
                id,
            },
        });
        if (!publicToiletReview) {
            throw new NotFoundException(`Public Toilet with id ${id} not found`);
        }
        return publicToiletReview;
    }

    async update(
        id: number,
        updatePublicToiletReviewInput: UpdatePublicToiletReviewInput,
        user: number,
    ): Promise<PublicToiletReview> {
        const review: PublicToiletReview = await this.findOne(id);
        checkUserIsAuthor(user, review.author);
        return this.publicToiletReviewRepository.save({
            ...review,
            ...updatePublicToiletReviewInput,
        });
    }

    async remove(id: number, user: number) {
        const review: PublicToiletReview = await this.findOne(id);
        checkUserIsAuthor(user, review.author);
        await this.publicToiletReviewRepository.delete(review.id);
        return review;
    }

}