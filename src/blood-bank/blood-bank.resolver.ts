import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MakePublic } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import { BloodBankService } from './blood-bank.service';
import { CreateBloodRequestInput } from './dto/create-blood-bank.input';
import { UpdateBloodRequestInput } from './dto/update-blood-bank.input';
import { Acceptors, BloodRequest } from './entities/blood-bank.entity';

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

  @Query(() => [BloodRequest], { name: 'bloodRequests' })
  async getAllBloodRequests(@User() user: number): Promise<BloodRequest[]> {
    checkUserAuthenticated(user);
    return this.bloodRequestService.findAll(user);
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
}
