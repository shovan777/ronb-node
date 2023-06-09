import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { connectionFromArraySlice } from 'graphql-relay';
import { User, usersRole } from '@app/shared/common/decorators/user.decorator';
import ConnectionArgs from '@app/shared/common/pagination/types/connection.args';
import { checkUserAuthenticated } from '@app/shared/common/utils/checkUserAuthentication';
import {
  CreateDistrictInput,
  CreateProvinceInput,
  CreateYellowPagesAddressInput,
  CreateYellowPagesCategoryInput,
  CreateYellowPagesEmailInput,
  CreateYellowPagesInput,
  CreateYellowPagesPhoneNumberInput,
} from './dto/create-yellow-pages.input';
import { FetchPaginationArgs } from '@app/shared/common/pagination/fetch-pagination-input';
import {
  PublishYellowPagesInput,
  UpdateDistrictInput,
  UpdateProvinceInput,
  UpdateYellowPagesAddressInput,
  UpdateYellowPagesCategoryInput,
  UpdateYellowPagesEmailInput,
  UpdateYellowPagesInput,
  UpdateYellowPagesPhoneNumberInput,
} from './dto/update-yellow-pages.input';
import {
  YellowPagesAddress,
  YellowPages,
  YellowPagesPhoneNumber,
  YellowPagesCatgory,
  Province,
  District,
  YellowPagesEmail,
} from '@app/shared/entities/yellow-pages.entity';
import {
  YellowPagesResponse,
  YellowPagesCategoryResponse,
  YellowPagesAdminResponse,
} from './yellow-pages.response';
import {
  YellowPagesService,
  YellowPagesAddressService,
  YellowPagesPhoneNumberService,
  YellowPagesCategoryService,
  ProvinceService,
  DistrictService,
  YellowPagesEmailService,
} from './yellow-pages.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@app/shared/common/decorators/roles.decorator';
import { Role } from '@app/shared/common/enum/role.enum';
import { RolesGuard } from '@app/shared/common/guards/roles.guard';
import { MakePublic } from '@app/shared/common/decorators/public.decorator';
import {
  FilterDistrictInput,
  FilterYellowPagesInput,
} from './dto/filter-yellowpages.input';

@Resolver(() => YellowPages)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class YellowPagesResolver {
  constructor(private readonly yellowPagesService: YellowPagesService) {}

  @Mutation(() => YellowPages)
  @Roles(Role.Writer)
  async createYellowPages(
    @Args('createYellowPagesInput')
    createYellowPagesInput: CreateYellowPagesInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesService.create(createYellowPagesInput, user);
  }

  @Query(() => YellowPagesResponse, { name: 'yellowPages' })
  @MakePublic()
  async getAllYellowPages(
    @Args() args: ConnectionArgs,
    @Args('filterYellowPagesInput', { nullable: true })
    filterYellowPagesInput?: FilterYellowPagesInput,
  ): Promise<YellowPagesResponse> {
    const { limit, offset } = args.pagingParams();
    const [yellowPages, count] = await this.yellowPagesService.findAllSearch(
      limit,
      offset,
      filterYellowPagesInput,
      true,
    );

    const page = connectionFromArraySlice(yellowPages, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => YellowPagesAdminResponse, { name: 'yellowPagesAdmin' })
  @Roles(Role.Writer, Role.Publisher)
  async getAllYellowPagesAdmin(
    @Args() args: FetchPaginationArgs,
    @Args('filterYellowPagesInput', { nullable: true })
    filterYellowPagesInput?: FilterYellowPagesInput,
  ): Promise<YellowPagesAdminResponse> {
    const [yellowpages, count] = await this.yellowPagesService.findAllSearch(
      args.take,
      args.skip,
      filterYellowPagesInput,
    );
    return { data: yellowpages, count };
  }

  @Query(() => YellowPages, { name: 'yellowPagesById' })
  @MakePublic()
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesService.findOne(id);
  }

  @Mutation(() => YellowPages)
  @Roles(Role.Writer)
  async updateYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesInput')
    updateYellowPagesInput: UpdateYellowPagesInput,
    @User() user: number,
    @usersRole() role: string,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesService.update(
      id,
      updateYellowPagesInput,
      user,
      role,
    );
  }

  @Mutation(() => YellowPages)
  @Roles(Role.Publisher)
  async publishYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @Args('publishYellowPagesInput')
    publishYellowPagesInput: PublishYellowPagesInput,
    @User() user: number,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesService.publish(
      id,
      publishYellowPagesInput,
      user,
    );
  }

  @Mutation(() => YellowPages)
  @Roles(Role.Writer)
  async removeYellowPagesImage(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
    @usersRole() role: string,
  ): Promise<YellowPages> {
    checkUserAuthenticated(user);
    return this.yellowPagesService.removeImage(id, user, role);
  }

  @Mutation(() => YellowPages)
  @Roles(Role.Writer)
  async removeYellowPages(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
    @usersRole() role: string,
  ): Promise<YellowPages> {
    checkUserAuthenticated(user);
    return this.yellowPagesService.remove(id, user, role);
  }
}

@Resolver()
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class YellowPagesCategoryResolver {
  constructor(
    private readonly yellowPagesCategoryService: YellowPagesCategoryService,
  ) {}

  @Mutation(() => YellowPagesCatgory)
  @Roles(Role.Writer)
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
  @MakePublic()
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
  @Roles(Role.Writer, Role.Publisher)
  async getAllYellowPagesCategoryAdmin(
    @Args() args: FetchPaginationArgs,
  ): Promise<any> {
    return this.yellowPagesCategoryService.adminFindAll(args);
  }

  @Query(() => YellowPagesCatgory, { name: 'yellowPagesCategoryById' })
  @MakePublic()
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

@Resolver(() => YellowPagesAddress)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class YellowPagesAddressResolver {
  constructor(
    private readonly yellowPagesAddressService: YellowPagesAddressService,
  ) {}

  @Mutation(() => YellowPagesAddress)
  @Roles(Role.Writer)
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
  @MakePublic()
  async findAll(): Promise<YellowPagesAddress[]> {
    return this.yellowPagesAddressService.findAll();
  }

  @Query(() => YellowPagesAddress, { name: 'yellowPagesAddressById' })
  @MakePublic()
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesAddressService.findOne(id);
  }

  @ResolveField(() => District)
  @MakePublic()
  async district(@Parent() yellowPagesAddress: YellowPagesAddress) {
    const { id } = yellowPagesAddress;
    return await this.yellowPagesAddressService.findDistrictofAddress(id);
  }

  @ResolveField(() => Province)
  @MakePublic()
  async province(@Parent() yellowPagesAddress: YellowPagesAddress) {
    const { id } = yellowPagesAddress;
    return await this.yellowPagesAddressService.findProvinceofAddress(id);
  }

  @Mutation(() => YellowPagesAddress)
  @Roles(Role.Writer)
  async updateYellowPagesAddress(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesAddressInput')
    updateYellowPagesAddress: UpdateYellowPagesAddressInput,
    @User() user: number,
    @usersRole() role: string,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesAddressService.update(
      id,
      role,
      updateYellowPagesAddress,
    );
  }

  @Mutation(() => YellowPagesAddress)
  @Roles(Role.Writer)
  async removeYellowPagesAddress(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
    @usersRole() role: string,
  ): Promise<YellowPagesAddress> {
    checkUserAuthenticated(user);
    return this.yellowPagesAddressService.remove(id, role);
  }
}

@Resolver()
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class ProvinceResolver {
  constructor(private readonly provinceService: ProvinceService) {}

  @Query(() => [Province], { name: 'provinces' })
  @MakePublic()
  async getAllProvince(): Promise<Province[]> {
    return this.provinceService.findAll();
  }

  @Query(() => Province, { name: 'provinceById' })
  @MakePublic()
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Province> {
    return this.provinceService.findOne(id);
  }

  @Mutation(() => Province)
  @Roles(Role.Writer)
  async createProvince(
    @Args('createProvinceInput') createProvinceInput: CreateProvinceInput,
    @User() user: number,
  ): Promise<Province> {
    checkUserAuthenticated(user);
    return this.provinceService.create(createProvinceInput);
  }

  @Mutation(() => Province)
  @Roles(Role.Writer)
  async updateProvince(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProvinceInput') updateProvinceInput: UpdateProvinceInput,
    @User() user: number,
  ): Promise<Province> {
    checkUserAuthenticated(user);
    return this.provinceService.update(id, updateProvinceInput);
  }

  @Mutation(() => Province)
  @Roles(Role.Writer)
  async removeProvince(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<Province> {
    checkUserAuthenticated(user);
    return this.provinceService.remove(id);
  }
}

@Resolver(() => District)
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class DistrictResolver {
  constructor(private readonly districtService: DistrictService) {}

  @Mutation(() => District)
  @Roles(Role.Writer)
  async creatDistrict(
    @Args('createDistrictInput') createDistrictInput: CreateDistrictInput,
    @User() user: number,
  ): Promise<District> {
    checkUserAuthenticated(user);
    return await this.districtService.create(createDistrictInput);
  }

  @Query(() => [District], { name: 'districts' })
  @MakePublic()
  async findAll(
    @Args('filterDistrictInput', { nullable: true })
    filterDistrictInput: FilterDistrictInput,
  ): Promise<District[]> {
    console.log('api req from font-end');
    return await this.districtService.findAll(filterDistrictInput);
  }

  @Mutation(() => District)
  @Roles(Role.Writer)
  async updateDistrict(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDistrictInput') updateDistrictInput: UpdateDistrictInput,
    @User() user: number,
  ): Promise<District> {
    checkUserAuthenticated(user);
    return this.districtService.update(id, updateDistrictInput);
  }

  @Mutation(() => District)
  @Roles(Role.Writer)
  async removeDistrict(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
  ): Promise<District> {
    checkUserAuthenticated(user);
    return this.districtService.remove(id);
  }
}

@Resolver()
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class YellowPagesPhoneNumberResolver {
  constructor(
    private readonly yellowPagesPhoneNumberService: YellowPagesPhoneNumberService,
  ) {}

  @Mutation(() => YellowPagesPhoneNumber)
  @Roles(Role.Writer)
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
  @MakePublic()
  async findAll(): Promise<YellowPagesPhoneNumber[]> {
    return await this.yellowPagesPhoneNumberService.findAll();
  }

  @Query(() => YellowPagesPhoneNumber, { name: 'yellowPagesPhoneNumberById' })
  @MakePublic()
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesPhoneNumberService.findOne(id);
  }

  @Mutation(() => YellowPagesPhoneNumber)
  async updateYellowPagesPhoneNumber(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesPhoneNumberInput')
    updateYellowPagesPhoneNumberInput: UpdateYellowPagesPhoneNumberInput,
    @User() user: number,
    @usersRole() role: string,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesPhoneNumberService.update(
      id,
      role,
      updateYellowPagesPhoneNumberInput,
    );
  }

  @Mutation(() => YellowPagesPhoneNumber)
  async removeYellowPagesPhoneNumber(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
    @usersRole() role: string,
  ): Promise<YellowPagesPhoneNumber> {
    checkUserAuthenticated(user);
    return this.yellowPagesPhoneNumberService.remove(id, role);
  }
}

@Resolver()
@Roles(Role.Admin, Role.SuperAdmin)
@UseGuards(RolesGuard)
export class YellowPagesEmailResolver {
  constructor(
    private readonly yellowPagesEmailService: YellowPagesEmailService,
  ) {}

  @Mutation(() => YellowPagesEmail)
  @Roles(Role.Writer)
  async createYellowPagesEmail(
    @Args('createYellowPagesEmailInput')
    createYellowPagesEmailInput: CreateYellowPagesEmailInput,
    @User() user: number,
  ): Promise<YellowPagesEmail> {
    checkUserAuthenticated(user);
    return await this.yellowPagesEmailService.create(
      createYellowPagesEmailInput,
    );
  }

  @Query(() => [YellowPagesEmail], { name: 'yellowPagesEmail' })
  @MakePublic()
  async findAll(): Promise<YellowPagesEmail[]> {
    return await this.yellowPagesEmailService.findAll();
  }

  @Query(() => YellowPagesEmail, { name: 'yellowPagesEmailById' })
  @MakePublic()
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.yellowPagesEmailService.findOne(id);
  }

  @Mutation(() => YellowPagesEmail)
  async updateYellowPagesEmail(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateYellowPagesEmailInput')
    updateYellowPagesEmailInput: UpdateYellowPagesEmailInput,
    @User() user: number,
    @usersRole() role: string,
  ) {
    checkUserAuthenticated(user);
    return await this.yellowPagesEmailService.update(
      id,
      role,
      updateYellowPagesEmailInput,
    );
  }

  @Mutation(() => YellowPagesEmail)
  async removeYellowPagesEmail(
    @Args('id', { type: () => Int }) id: number,
    @User() user: number,
    @usersRole() role: string,
  ) {
    checkUserAuthenticated(user);
    return this.yellowPagesEmailService.remove(id, role);
  }
}
