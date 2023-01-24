import { Args, Int, Mutation, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";
import { connectionFromArraySlice } from "graphql-relay";
import { getAuthor } from "src/users/users.resolver";
import { UsersService } from "src/users/users.service";
import { Author } from "src/users/entitiy/users.entity";
import { User } from "src/common/decorators/user.decorator";
import ConnectionArgs from "src/common/pagination/types/connection.args";
import { checkUserAuthenticated } from "src/common/utils/checkUserAuthentication";
import { CreatePublicToiletReviewInput } from "./dto/create-reviews.input";
import { PublicToiletReview } from "./entities/reviews.entity";
import PublicToiletReviewsResponse from "./reviews.response";
import { PublicToiletReviewsService } from "./reviews.service";
import { UpdatePublicToiletReviewInput } from "./dto/update-reviews.input";
import { UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enum/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { MakePublic } from "src/common/decorators/public.decorator";


@Resolver(() => PublicToiletReview)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class PublicToiletReviewsResolver {
    constructor(
        private readonly publicToiletReviewsService: PublicToiletReviewsService,
        private readonly userService: UsersService,
    ) {}
    

    // Mutations
    @Mutation(() => PublicToiletReview)
    @MakePublic()
    createPublicToiletReview(
        @Args('createPublicToiletReviewsInput')
        createPublicToiletReviewInput: CreatePublicToiletReviewInput,
        @User() user: number,
    ) {
        checkUserAuthenticated(user);
        return this.publicToiletReviewsService.create(createPublicToiletReviewInput, user);
    }

    @Mutation(() => PublicToiletReview)
    @MakePublic()
    updatePublicToiletReview(
        @User() user: number,
        @Args('publicToiletId', { type: () => Int }) publicToiletId: number,
        @Args('updatePublicToiletReviewInput')
        updatePublicToiletReviewInput: UpdatePublicToiletReviewInput,
    ) {
        checkUserAuthenticated(user);
        return this.publicToiletReviewsService.update(
            updatePublicToiletReviewInput,
            user,
            publicToiletId,
        );
    }

    @Mutation(() => PublicToiletReview)
    @MakePublic()
    removePublicToiletReview(
        @Args('publicToiletId', { type: () => Int }) publicToiletId: number,
        @User() user: number,
    ) {
        checkUserAuthenticated(user);
        return this.publicToiletReviewsService.remove(publicToiletId, user);
    }


    // Query 
    @Query(() => PublicToiletReviewsResponse, { name: 'publicToiletReview' })
    @MakePublic()
    async findAll(
        @Args('publicToiletId', {type: () => Int}) publicToiletId: number,
        @Args() args: ConnectionArgs,
    ): Promise<PublicToiletReviewsResponse> {
        const { limit, offset } = args.pagingParams();
        const [reveiws, count] = await this.publicToiletReviewsService.findAll(
            publicToiletId,
            limit,
            offset,
        );
        const page = connectionFromArraySlice(reveiws, args, {
            arrayLength: count,
            sliceStart: offset || 0,
        });
        return {
            page,
            pageData: {
                count, limit, offset
            }
        }
    }

    @Query(() => PublicToiletReview, {name:'publicToiletComment'})
    @MakePublic()
    findOne(
        @Args('publicToiletId', { type: () => Int }) publicToiletId: number,
        @User() user: number,
    ) {
        return this.publicToiletReviewsService.findOne(publicToiletId, user);
    }


    // Resolver
    @ResolveField(() => Author)
    @MakePublic()
    async authorDetail(@Parent() publicToiletReview: PublicToiletReview): Promise<Author> {
        const {author} = publicToiletReview;
        const authDetail = getAuthor(this.userService, author);
        return authDetail
    }

}