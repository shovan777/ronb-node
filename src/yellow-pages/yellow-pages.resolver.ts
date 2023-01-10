import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { connectionFromArraySlice } from 'graphql-relay';
import { User } from 'src/common/decorators/user.decorator';
import ConnectionArgs from 'src/common/pagination/types/connection.args';
import { checkUserAuthenticated } from 'src/common/utils/checkUserAuthentication';
import {
  CreateYellowPagesAddressInput,
  CreateYellowPagesCategoryInput,
  CreateYellowPagesInput,
  CreateYellowPagesPhoneNumberInput,
} from './dto/create-yellow-pages.input';
import { FetchPaginationArgs } from '../common/pagination/fetch-pagination-input';
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
  YellowPagesResponse,
  YellowPagesCategoryResponse,
} from './yellow-pages.response';
import {
  YellowPagesService,
  YellowPagesAddressService,
  YellowPagesPhoneNumberService,
  YellowPagesCategoryService,
} from './yellow-pages.service';
import { ErrorLoggerInterceptor } from 'src/common/interceptors/errorlogger.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Resolver()
@UseInterceptors(ErrorLoggerInterceptor)
export class YellowPagesResolver {
  constructor(private readonly yellowPagesService: YellowPagesService) {}

  @Mutation(() => YellowPages)
  async createYellowPages(
    @Args('createYellowPagesInput')
    createYellowPagesInput: CreateYellowPagesInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesService.create(createYellowPagesInput);
  }

  @Query(() => YellowPagesResponse, { name: 'yellowPages' })
  async getAllYellowPages(
    @Args() args: ConnectionArgs,
  ): Promise<YellowPagesResponse> {
    const { limit, offset } = args.pagingParams();
    const [yellowPages, count] = await this.yellowPagesService.findAll(
      limit,
      offset,
    );

    const page = connectionFromArraySlice(yellowPages, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => [YellowPages], { name: 'yellowPagesAdmin' })
  async getAllYellowPagesAdmin(
    @Args() args: FetchPaginationArgs,
  ): Promise<any> {
    return this.yellowPagesService.adminFindAll(args);
  }

  @Query(() => YellowPages, { name: 'yellowPagesById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesService.findOne(id);
  }

  @Mutation(() => YellowPages)
  async updateYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesInput')
    @User()
    user: number,
    updateYellowPagesInput: UpdateYellowPagesInput,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesService.update(id, updateYellowPagesInput);
  }

  @Mutation(() => YellowPages)
  async removeYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<YellowPages> {
    checkUserAuthenticated(user);
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
    checkUserAuthenticated(user);
    return await this.yellowPagesCategoryService.create(
      createYellowPagesCategoryInput,
      user,
    );
  }

  @Query(() => YellowPagesCategoryResponse, { name: 'yellowPagesCategories' })
  async getAllYellowPagesCategory(
    @Args() args: ConnectionArgs,
  ): Promise<YellowPagesCategoryResponse> {
    const { limit, offset } = args.pagingParams();
    const [yellowPagesCategory, count] =
      await this.yellowPagesCategoryService.findAll(limit, offset);

    const page = connectionFromArraySlice(yellowPagesCategory, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => [YellowPagesCatgory], { name: 'yellowPagesCategoryAdmin' })
  async getAllYellowPagesCategoryAdmin(
    @Args() args: FetchPaginationArgs,
  ): Promise<any> {
    return this.yellowPagesCategoryService.adminFindAll(args);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesCategoryService.update(
      id,
      updateYellowPagesCategoryInput,
    );
  }

  @Mutation(() => YellowPagesCatgory)
  async removeYellowPagesCategory(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<YellowPagesCatgory> {
    checkUserAuthenticated(user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesAddressService.update(
      id,
      updateYellowPagesAddress,
    );
  }

  @Mutation(() => YellowPagesAddress)
  async removeYellowPagesAddress(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<YellowPagesAddress> {
    checkUserAuthenticated(user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
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
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesPhoneNumberService.update(
      id,
      updateYellowPagesPhoneNumberInput,
    );
  }

  @Mutation(() => YellowPagesPhoneNumber)
  async removeYellowPagesPhoneNumber(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<YellowPagesPhoneNumber> {
    checkUserAuthenticated(user);
    return this.yellowPagesPhoneNumberService.remove(id);
  }
}
