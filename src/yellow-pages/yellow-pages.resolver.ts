import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/common/decorators/user.decorator';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import {
  CreateYellowPagesAddressInput,
  CreateYellowPagesCategoryInput,
  CreateYellowPagesInput,
  CreateYellowPagesPhoneNumberInput,
} from './dto/create-yellow-pages.input';
import {
  UpdateYellowPagesAddressInput,
  UpdateYellowPagesCategoryInput,
  UpdateYellowPagesInput,
  UpdateYellowPagesPhoneNumberInput,
} from './dto/update-yellow-pages.input';
import {
  YellowPagesAddress,
  YellowPages,
  YellowPagesPhoneNumber,
  YellowPagesCatgory,
} from './entities/yellow-pages.entity';
import {
  YellowPagesService,
  YellowPagesAddressService,
  YellowPagesPhoneNumberService,
  YellowPagesCategoryService,
} from './yellow-pages.service';

@Resolver()
export class YellowPagesResolver {
  constructor(private readonly yellowPagesService: YellowPagesService) {}

  @Mutation(() => YellowPages)
  async createYellowPages(
    @Args('createYellowPagesInput')
    createYellowPagesInput: CreateYellowPagesInput,
  ) {
    return await this.yellowPagesService.create(createYellowPagesInput);
  }

  @Query(() => [YellowPages], { name: 'yellowPages' })
  async getAllYellowPages(): Promise<YellowPages[]> {
    return this.yellowPagesService.findAll();
  }

  @Query(() => YellowPages, { name: 'yellowPagesById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesService.findOne(id);
  }

  @Mutation(() => YellowPages)
  async updateYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesInput')
    updateYellowPagesInput: UpdateYellowPagesInput,
  ) {
    return await this.yellowPagesService.update(id, updateYellowPagesInput);
  }

  @Mutation(() => YellowPages)
  async removeYellowPages(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<YellowPages> {
    return this.yellowPagesService.remove(id);
  }
}

@Resolver()
export class YellowPagesCategoryResolver {
  constructor(
    private readonly yellowPagesCategoryService: YellowPagesCategoryService,
  ) {}

  @Mutation(() => YellowPagesCatgory)
  async createYellowPagesCategory(
    @Args('createYellowPagesCategoryInput')
    createYellowPagesCategoryInput: CreateYellowPagesCategoryInput,
    @User() user: number,
  ) {
    // checkUserAuthenticated(user);
    return await this.yellowPagesCategoryService.create(
      createYellowPagesCategoryInput,
      1,
    );
  }

  @Query(() => [YellowPagesCatgory], { name: 'yellowPagesCategories' })
  async getAllYellowPagesCategory(): Promise<YellowPagesCatgory[]> {
    return this.yellowPagesCategoryService.findAll();
  }

  @Query(() => YellowPagesCatgory, { name: 'yellowPagesCategoryById' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<YellowPagesCatgory> {
    return this.yellowPagesCategoryService.findOne(id);
  }

  @Mutation(() => YellowPagesCatgory)
  async updateYellowPagesCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesCategoryInput')
    updateYellowPagesCategoryInput: UpdateYellowPagesCategoryInput,
  ) {
    return await this.yellowPagesCategoryService.update(
      id,
      updateYellowPagesCategoryInput,
    );
  }

  @Mutation(() => YellowPagesCatgory)
  async removeYellowPagesCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<YellowPagesCatgory> {
    return this.yellowPagesCategoryService.remove(id);
  }
}

@Resolver()
export class YellowPagesAddressResolver {
  constructor(
    private readonly yellowPagesAddressService: YellowPagesAddressService,
  ) {}

  @Mutation(() => YellowPagesAddress)
  async createYellowPagesAddress(
    @Args('createYellowPagesAddressInput')
    createYellowPagesAddressInput: CreateYellowPagesAddressInput,
  ) {
    return await this.yellowPagesAddressService.create(
      createYellowPagesAddressInput,
    );
  }

  @Query(() => [YellowPagesAddress], { name: 'yellowPagesAddress' })
  async findAll(): Promise<YellowPagesAddress[]> {
    return this.yellowPagesAddressService.findAll();
  }

  @Query(() => YellowPagesAddress, { name: 'yellowPagesAddressById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesAddressService.findOne(id);
  }

  @Mutation(() => YellowPagesAddress)
  async updateYellowPagesAddress(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesAddressInput')
    updateYellowPagesAddress: UpdateYellowPagesAddressInput,
  ) {
    return await this.yellowPagesAddressService.update(
      id,
      updateYellowPagesAddress,
    );
  }

  @Mutation(() => YellowPagesAddress)
  async removeYellowPagesAddress(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<YellowPagesAddress> {
    return this.yellowPagesAddressService.remove(id);
  }
}

@Resolver()
export class YellowPagesPhoneNumberResolver {
  constructor(
    private readonly yellowPagesPhoneNumberService: YellowPagesPhoneNumberService,
  ) {}

  @Mutation(() => YellowPagesPhoneNumber)
  async createYellowPagesPhoneNumber(
    @Args('createYellowPagesPhoneNumberInput')
    createYellowPagesPhoneNumberInput: CreateYellowPagesPhoneNumberInput,
  ) {
    return await this.yellowPagesPhoneNumberService.create(
      createYellowPagesPhoneNumberInput,
    );
  }

  @Query(() => [YellowPagesPhoneNumber], { name: 'yellowPagesPhoneNumber' })
  async findAll(): Promise<YellowPagesPhoneNumber[]> {
    return await this.yellowPagesPhoneNumberService.findAll();
  }

  @Query(() => YellowPagesPhoneNumber, { name: 'yellowPagesPhoneNumberById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesPhoneNumberService.findOne(id);
  }

  @Mutation(() => YellowPagesPhoneNumber)
  async updateYellowPagesPhoneNumber(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesPhoneNumberInput')
    updateYellowPagesPhoneNumberInput: UpdateYellowPagesPhoneNumberInput,
  ) {
    console.log(
      'updateYellowPagesPhoneNumberInput',
      updateYellowPagesPhoneNumberInput,
    );
    return await this.yellowPagesPhoneNumberService.update(
      id,
      updateYellowPagesPhoneNumberInput,
    );
  }

  @Mutation(() => YellowPagesPhoneNumber)
  async removeYellowPagesPhoneNumber(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<YellowPagesPhoneNumber> {
    return this.yellowPagesPhoneNumberService.remove(id);
  }
}
