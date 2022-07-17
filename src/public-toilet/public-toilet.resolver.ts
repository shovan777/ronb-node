import {
    Resolver, 
    Query,
    Mutation,
    Args,
    Int,
    ResolveField,
    Parent,
} from '@nestjs/graphql';
import { PublicToiletService } from './public-toilet.service';
import { PublicToilet, PublicToiletImage } from './entities/public-toilet.entity';
import { CreatePublicToiletInput } from './dto/create-public-toilet.input';
import { UpdatePublicToiletInput } from './dto/update-public-toilet.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => PublicToilet)
export class PublicToiletResolver {
    constructor(private readonly publicToiletService: PublicToiletService) {}

    @Mutation(() => PublicToilet)
    async createPublicToilet(@Args('createPublicToiletInput') createPublicToiletInput: CreatePublicToiletInput) {
        return await this.publicToiletService.create(createPublicToiletInput);
    }

    @Query(() => [PublicToilet], { name: 'publicToilets' })
    findAll() {
        return this.publicToiletService.findAll();
    }

    @Query(() => PublicToilet, { name: 'publicToiletById' })
    findOne(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<PublicToilet | NotFoundException> {
        return this.publicToiletService.findOne(id);
    }

    @ResolveField(() => [PublicToiletImage])
    async images(@Parent() publicToilet: PublicToilet) {
        const {id}  = publicToilet;
        if (publicToilet.images) {
            return publicToilet.images;
        }
        return await this.publicToiletService.findImagesOfPublicToilet(id);
    }

    @Mutation(() => PublicToilet)
    async updatePublicToilet(
        @Args({ name: 'id', type: () => Int }) id: number,
        @Args('updatePublicToiletInput') updatePublicToiletInput: UpdatePublicToiletInput,
    ) {
        return await this.publicToiletService.update(id, updatePublicToiletInput);
    }

    @Mutation(() => PublicToilet)
    removePublicToilet(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<NotFoundException | any> {
        return this.publicToiletService.remove(id);
    }
}