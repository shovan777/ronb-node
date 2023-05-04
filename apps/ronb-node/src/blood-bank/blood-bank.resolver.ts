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
} from './blood-bank.response';
import { FetchPaginationArgs } from '@app/shared/common/pagination/fetch-pagination-input';

@Resolver()
@MakePublic()
export class BloodBankResolver {
  constructor(private readonly bloodRequestService: BloodBankService) {}

  @Mutation(() => BloodRequest)
  async createBloodRequest(
    @Args('createBloodBankInput') createBloodBankInput: CreateBloodRequestInput,
    @User() user: number,
  ): Promise<BloodRequest> {
    return this.bloodRequestService.create(createBloodBankInput, user);
  }

  @Query(() => BloodRequestAdminResponse, { name: 'bloodRequests' })
  async getAllBloodRequests(
    @Args() args: FetchPaginationArgs,
    @User() user: number,
  ): Promise<BloodRequestAdminResponse> {
    checkUserAuthenticated(user);
    const [bloodRequest, count] = await this.bloodRequestService.findAll(
      args.take,
      args.skip,
      user,
    );
    return { data: bloodRequest, count: count };
  }

  @Query(() => [BloodRequest], { name: 'mybloodRequests' })
  async getMyBloodRequests(@User() user: number): Promise<BloodRequest[]> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.findMyRequest(user);
  }

  @Query(() => BloodRequest, { name: 'bloodRequestById' })
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
  async acceptBloodRequest(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<BloodRequest> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.acceptRequest(id, user);
  }

  @Query(() => [Acceptors], { name: 'getAcceptors' })
  async getAcceptors(@Args('id', { type: () => Int }) id: number) {
    return this.bloodRequestService.getAcceptors(id);
  }

  @Query(() => BloodBankDonerListResponse, { name: 'getAllDoners' })
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
  async getBloodRecords(): Promise<BloodRecordResponse> {
    return this.bloodRequestService.bloodRecords();
  }
}
