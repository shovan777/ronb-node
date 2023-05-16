import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MakePublic } from '@app/shared/common/decorators/public.decorator';
import { User } from '@app/shared/common/decorators/user.decorator';
import { checkUserAuthenticated } from '@app/shared/common/utils/checkUserAuthentication';
import { BloodBankService } from './blood-bank.service';
import { CreateBloodRequestInput } from './dto/create-blood-bank.input';
import { UpdateBloodRequestInput } from './dto/update-blood-bank.input';
import {
  Acceptors,
  BloodRequest,
} from '@app/shared/entities/blood-bank.entity';
import { Author } from '@app/shared/entities/users.entity';
import {
  BloodBankDonerListResponse,
  BloodRecordResponse,
  BloodRequestAdminResponse,
  BloodRequestResponse,
} from './blood-bank.response';
import { FetchPaginationArgs } from '@app/shared/common/pagination/fetch-pagination-input';
import ConnectionArgs from '@app/shared/common/pagination/types/connection.args';
import { FilterBloodRequestInput } from './dto/filter-blood-group.input';
import { connectionFromArraySlice } from 'graphql-relay';
import { BloodEligibilityGuard } from '@app/shared/common/guards/bloodEligibility.guard';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '@app/shared/common/guards/admin.guard';
import { BloodRequestAcceptLimit, BloodRequestCreateLimit } from '@app/shared/common/guards/bloodReqLimit.guard';

@Resolver()
@MakePublic()
export class BloodBankResolver {
  constructor(private readonly bloodRequestService: BloodBankService) {}

  @Mutation(() => BloodRequest)
  @UseGuards(BloodEligibilityGuard, BloodRequestCreateLimit)
  async createBloodRequest(
    @Args('createBloodBankInput') createBloodBankInput: CreateBloodRequestInput,
    @User() user: number,
  ): Promise<BloodRequest> {
    return this.bloodRequestService.create(createBloodBankInput, user);
  }

  @Query(() => BloodRequestAdminResponse, { name: 'bloodRequestsAdmin' })
  @UseGuards(AdminGuard)
  async getAllBloodRequestsAdmin(
    @Args() args: FetchPaginationArgs,
    @User() user: number,
  ): Promise<BloodRequestAdminResponse> {
    checkUserAuthenticated(user);
    const [bloodRequest, count] = await this.bloodRequestService.findAllAdmin(
      args.take,
      args.skip,
    );
    return { data: bloodRequest, count: count };
  }

  @Query(() => BloodRequestResponse, { name: 'bloodRequests' })
  @UseGuards(BloodEligibilityGuard)
  async getAllBloodRequest(
    @User() user: number,
    @Args() args: ConnectionArgs,
    @Args('filterBloodRequestInput', { nullable: true })
    filterBloodRequestInput?: FilterBloodRequestInput,
  ): Promise<BloodRequestResponse> {
    const { limit, offset } = args.pagingParams();
    const [bloodRequest, count] = await this.bloodRequestService.findAll(
      limit,
      offset,
      user,
      filterBloodRequestInput,
    );

    const page = connectionFromArraySlice(bloodRequest, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => [BloodRequest], { name: 'mybloodRequests' })
  @UseGuards(BloodEligibilityGuard)
  async getMyBloodRequests(@User() user: number): Promise<BloodRequest[]> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.findMyRequest(user);
  }

  @Query(() => BloodRequest, { name: 'bloodRequestById' })
  @UseGuards(BloodEligibilityGuard)
  async getOneBloodRequest(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BloodRequest> {
    return this.bloodRequestService.findOne(id);
  }

  @Mutation(() => BloodRequest)
  async updateBloodRequest(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBloodRequestInput')
    updateBloodRequestInput: UpdateBloodRequestInput,
    @User() user: number,
  ): Promise<BloodRequest> {
    return this.bloodRequestService.update(id, updateBloodRequestInput, user);
  }

  @Mutation(() => BloodRequest)
  async removeBloodRequest(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<BloodRequest> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.remove(id, user);
  }

  @Mutation(() => BloodRequest)
  @UseGuards(BloodEligibilityGuard, BloodRequestAcceptLimit)
  async acceptBloodRequest(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<BloodRequest> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.acceptRequest(id, user);
  }

  @Mutation(() => BloodRequest)
  async cancelBloodRequest(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<BloodRequest> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.cancelRequest(id, user);
  }

  @Mutation(() => BloodRequest)
  async addDoners(
    @Args('id', { type: () => Int }) id: number,
    @Args('usersID', { type: () => [Int] }) usersID: [number],
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return this.bloodRequestService.addDoners(id, usersID);
  }

  @Query(() => [Acceptors], { name: 'getAcceptors' })
  async getAcceptors(@Args('id', { type: () => Int }) id: number) {
    return this.bloodRequestService.getAcceptors(id);
  }

  @Query(() => [Acceptors], { name: 'getDonorsOfBloodRequest' })
  async getDonors(@Args('id', { type: () => Int }) id: number) {
    return this.bloodRequestService.getDoners(id);
  }

  @Query(() => BloodBankDonerListResponse, { name: 'getAllDoners' })
  @UseGuards(AdminGuard)
  async findAllDoners(
    @Args() args: FetchPaginationArgs,
  ): Promise<BloodBankDonerListResponse> {
    const { doners, count } = await this.bloodRequestService.findAllDoners(
      args.take,
      args.skip,
    );
    return { data: doners, count: count };
  }

  @Query(() => BloodRecordResponse, { name: 'getBloodRecords' })
  @UseGuards(AdminGuard)
  async getBloodRecords(): Promise<BloodRecordResponse> {
    return this.bloodRequestService.bloodRecords();
  }
}
