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
import PublicToiletResponse from './public-toilet.response';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { GeoJSONPointScalar } from 'src/common/scalars/geojson/Point.scalar';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';


@Resolver(() => PublicToilet)
export class PublicToiletResolver {
    constructor(private readonly publicToiletService: PublicToiletService) {}

    @Mutation(() => PublicToilet)
    async createPublicToilet(
        @Args('createPublicToiletInput') createPublicToiletInput: CreatePublicToiletInput,
        @User() user: number,
    ) {
        checkUserAuthenticated(user);
        return await this.publicToiletService.create(createPublicToiletInput, user);
    }

    @Query(() => PublicToiletResponse, { name: 'publicToilets' })
    async findAll(@Args() args: ConnectionArgs): Promise<PublicToiletResponse> {
        const { limit, offset } = args.pagingParams();
        const [publicToilets, count] = await this.publicToiletService.findAll(limit, offset);
        const page = connectionFromArraySlice(publicToilets, args, {
            arrayLength: count,
            sliceStart: offset || 0,
        });
        return { page, pageData: { count, limit, offset } };
    }

    @Query(() => PublicToilet, { name: 'publicToiletById' })
    findOne(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<PublicToilet | NotFoundException> {
        return this.publicToiletService.findOne(id);
    }

    @Query(() => PublicToiletResponse, { name: 'publicToiletNearMe' })
    async findPublicToiletNearMe(@Args() args: ConnectionArgs, @Args('origin') origin: GeoJSONPointScalar): Promise<PublicToiletResponse> {
        const { limit, offset } = args.pagingParams();
        const [publicToilets, count] = await this.publicToiletService.findPublicToiletNearMe(
            limit, offset, origin,
        );

        const page = connectionFromArraySlice(publicToilets, args, {
            arrayLength: count,
            sliceStart: offset || 0,
        });
        return { page, pageData: { count, limit, offset } };
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
        @User() user: number,
    ) {
        checkUserAuthenticated(user);
        return await this.publicToiletService.update(id, updatePublicToiletInput, user);
    }

    @Mutation(() => PublicToilet)
    removePublicToilet(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<NotFoundException | any> {
        return this.publicToiletService.remove(id);
    }
}