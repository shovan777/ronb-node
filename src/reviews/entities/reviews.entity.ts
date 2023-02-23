import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Max, Min } from "class-validator";
import { BaseIdEntity } from "src/common/entities/base.entity";
import { PublicToilet } from "src/public-toilet/entities/public-toilet.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@ObjectType({ isAbstract: true })
export abstract class BaseReview {
    @Field(() => Int, { description: 'one wrote the review', })
    @PrimaryColumn({ type: 'int', nullable: false })
    author: number;

    @Field({ description: "Review content" })
    @Column()
    content: string;

    @Field(() => Int, { description: "Review rating" })
    @Column()
    @Min(0)
    @Max(5)
    rating: number;

    @Field({ description: 'date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @Field({ description: 'date of update' })
    @UpdateDateColumn()
    updatedAt: Date;
}


@Entity()
@ObjectType()
export class PublicToiletReview extends BaseReview {
    @Field(() => Int)
    @PrimaryColumn()
    publicToiletId: number;

    @JoinColumn({ name: 'publicToiletId' })
    @ManyToOne(() => PublicToilet, (publicToilet) => publicToilet.review, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    publicToilet: PublicToilet;
}

@ObjectType({ description: 'Total Reveiw and Rating' })
export class TotalReviewRatings{
    @Field(() => Float, { description: 'Total Rating' })
    totalRating: number;

    @Field(() => Int, { description: 'Total Reviewer' })
    totalReview: number;
}