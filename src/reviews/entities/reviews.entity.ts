import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Max, Min } from "class-validator";
import { BaseIdEntity } from "src/common/entities/base.entity";
import { PublicToilet } from "src/public-toilet/entities/public-toilet.entity";
import { Column, CreateDateColumn, Entity, IsNull, ManyToOne, UpdateDateColumn } from "typeorm";

@ObjectType({ isAbstract: true })
export abstract class BaseReview extends BaseIdEntity {
    @Field({ description: "Review content" })
    @Column()
    content: string;

    @Field(() => Int, { description: "Review rating" })
    @Column({
        nullable: true,
    })
    @Min(0)
    @Max(5)
    rating: number;

    @Field({ description: 'date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @Field({ description: 'date of update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => Int, { description: 'one wrote the review', })
    @Column()
    author: number;
}


@Entity()
@ObjectType()
export class PublicToiletReview extends BaseReview {
    @Field(() => PublicToilet)
    @ManyToOne(() => PublicToilet, (publicToilet) => publicToilet.review, {
        onDelete: 'CASCADE',
    })
    publicToilet: PublicToilet

}