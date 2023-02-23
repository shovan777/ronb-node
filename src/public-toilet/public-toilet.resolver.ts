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
import {
  PublicToilet,
  PublicToiletImage,
} from './entities/public-toilet.entity';
import { CreatePublicToiletInput } from './dto/create-public-toilet.input';
import { UpdatePublicToiletInput } from './dto/update-public-toilet.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  PublicToiletResponse,
  PublicToiletAdminResponse,
} from './public-toilet.response';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { GeoJSONPointScalar } from 'src/common/scalars/geojson/Point.scalar';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MakePublic } from 'src/common/decorators/public.decorator';
import { TotalReviewRatings } from 'src/reviews/entities/reviews.entity';
import { PublicToiletReviewsService } from 'src/reviews/reviews.service';
import { FetchPaginationArgs } from 'src/common/pagination/fetch-pagination-input';

@Resolver(() => PublicToilet)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class PublicToiletResolver {
  constructor(
    private readonly publicToiletService: PublicToiletService,
    private readonly publicToiletReviewService: PublicToiletReviewsService,
  ) {}

  // Mutations
  @Mutation(() => PublicToilet)
  @Roles(Role.Writer)
  async createPublicToilet(
    @Args('createPublicToiletInput')
    createPublicToiletInput: CreatePublicToiletInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.publicToiletService.create(createPublicToiletInput, user);
  }

  @Mutation(() => PublicToilet)
  @Roles(Role.Writer)
  async updatePublicToilet(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updatePublicToiletInput')
    updatePublicToiletInput: UpdatePublicToiletInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.publicToiletService.update(
      id,
      updatePublicToiletInput,
      user,
    );
  }

  @Mutation(() => PublicToilet)
  @Roles(Role.Writer)
  removePublicToilet(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<NotFoundException | any> {
    checkUserAuthenticated(user);
    return this.publicToiletService.remove(id, user);
  }

  @Mutation(() => PublicToiletImage)
  removePublicToiletImage(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<NotFoundException | any> {
    checkUserAuthenticated(user);
    return this.publicToiletService.removeImage(id);
  }

  //Query
  @Query(() => PublicToiletResponse, { name: 'publicToilets' })
  @MakePublic()
  async findAll(@Args() args: ConnectionArgs): Promise<PublicToiletResponse> {
    const { limit, offset } = args.pagingParams();
    const [publicToilets, count] = await this.publicToiletService.findAll(
      limit,
      offset,
      true,
    );
    const page = connectionFromArraySlice(publicToilets, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => PublicToiletAdminResponse, { name: 'publicToiletsAdmin' })
  @Roles(Role.Writer)
  async findAllAdmin(
    @Args() args: FetchPaginationArgs,
  ): Promise<PublicToiletAdminResponse> {
    const { take, skip } = args;
    const [publicToilets, count] = await this.publicToiletService.findAllAdmin(
      take,
      skip,
    );
    return { count, data: publicToilets };
  }

  @Query(() => PublicToilet, { name: 'publicToiletById' })
  @MakePublic()
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PublicToilet | NotFoundException> {
    return this.publicToiletService.findOne(id);
  }

  @Query(() => PublicToiletResponse, { name: 'publicToiletNearMe' })
  @MakePublic()
  async findPublicToiletNearMe(
    @Args() args: ConnectionArgs,
    @Args('origin') origin: GeoJSONPointScalar,
  ): Promise<PublicToiletResponse> {
    const { limit, offset } = args.pagingParams();
    const [publicToilets, count] =
      await this.publicToiletService.findPublicToiletNearMe(
        limit,
        offset,
        origin,
      );

    const page = connectionFromArraySlice(publicToilets, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });
    return { page, pageData: { count, limit, offset } };
  }

  //Resolve
  @ResolveField(() => [PublicToiletImage])
  @MakePublic()
  async images(@Parent() publicToilet: PublicToilet) {
    const { id } = publicToilet;
    if (publicToilet.images) {
      return publicToilet.images;
    }
    return await this.publicToiletService.findImagesOfPublicToilet(id);
  }

  @ResolveField(() => TotalReviewRatings, {
    description: 'Total Review Rating',
    nullable: true,
  })
  @MakePublic()
  async totalReviewRating(@Parent() publicToilet: PublicToilet) {
    const { id } = publicToilet;
    const [reviews, count] = await this.publicToiletReviewService.findAll(
      id,
      0,
      0,
    );
    let total_rating = 0;
    for (let review in reviews) {
      total_rating += reviews[review].rating;
    }
    const average_rating = count > 0 ? total_rating / count : 0;
    return {
      totalRating: average_rating,
      totalReview: count,
    };
  }
}
