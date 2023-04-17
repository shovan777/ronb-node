import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  UpdateDistrictInput,
  UpdateProvinceInput,
  UpdateYellowPagesAddressInput,
  UpdateYellowPagesCategoryInput,
  UpdateYellowPagesEmailInput,
  UpdateYellowPagesInput,
  UpdateYellowPagesPhoneNumberInput,
} from './dto/update-yellow-pages.input';
import {
  YellowPages,
  YellowPagesCatgory,
  YellowPagesAddress,
  YellowPagesPhoneNumber,
  District,
  Province,
  YellowPagesEmail,
} from '@app/shared/entities/yellow-pages.entity';
import { PublishState as YellowPagesPublishState } from '@app/shared/common/enum/publish_state.enum';
import {
  FilterDistrictInput,
  FilterYellowPagesInput,
} from './dto/filter-yellowpages.input';
import { uploadFileStream } from '@app/shared/common/utils/upload';
import { FilesService } from '@app/shared/common/services/files.service';
@Injectable()
export class YellowPagesService {
  constructor(
    @InjectRepository(YellowPages)
    private yellowPagesRepository: Repository<YellowPages>,
    @InjectRepository(YellowPagesCatgory)
    private yellowPagesCategoryeRepository: Repository<YellowPagesCatgory>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(YellowPagesAddress)
    private yellowPagesAddressRepository: Repository<YellowPagesAddress>,
    @InjectRepository(YellowPagesPhoneNumber)
    private yellowPagesPhoneNumberRepository: Repository<YellowPagesPhoneNumber>,
    @InjectRepository(YellowPagesEmail)
    private yellowPagesEmailRepository: Repository<YellowPagesEmail>,
    private fileService: FilesService,
  ) {}
  uploadDir = `${process.env.MEDIA_ROOT}/yellowpages`;

  async findAll(
    limit: number,
    offset: number,
    filterYellowPagesInput: FilterYellowPagesInput,
  ): Promise<[YellowPages[], number]> {
    const whereOptions: any = {};
    if (filterYellowPagesInput.category) {
      whereOptions.category = { id: filterYellowPagesInput.category };
    }
    if (filterYellowPagesInput.province | filterYellowPagesInput.district) {
      whereOptions.address = {
        province: { id: filterYellowPagesInput.province },
        district: { id: filterYellowPagesInput.district },
      };
    }
    return this.yellowPagesRepository.findAndCount({
      relations: ['address', 'phone_number', 'category', 'email'],
      where: { ...whereOptions },
      take: limit,
      skip: offset,
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllSearch(
    limit: number,
    offset: number,
    filterYellowPagesInput: FilterYellowPagesInput,
    publishedOnly = false,
  ) {
    const sqlQuery = this.yellowPagesRepository
      .createQueryBuilder('yellowpages')
      .leftJoinAndSelect('yellowpages.category', 'category')
      .leftJoinAndSelect('yellowpages.address', 'address')
      // .leftJoinAndSelect('address.district', 'district');
      // .leftJoinAndSelect('address.province', 'province');
      .leftJoinAndSelect('yellowpages.phone_number', 'phone_number')
      .leftJoinAndSelect('yellowpages.email', 'email');

    if (publishedOnly) {
      sqlQuery.where('yellowpages.state = :state', {
        state: YellowPagesPublishState.PUBLISHED,
      });
    }

    if (filterYellowPagesInput.category) {
      sqlQuery.andWhere('category.id = :categoryId', {
        categoryId: filterYellowPagesInput.category,
      });
    }

    if (filterYellowPagesInput.province) {
      sqlQuery.andWhere('address.province = :provinceId', {
        provinceId: filterYellowPagesInput.province,
      });
    }

    if (filterYellowPagesInput.district) {
      sqlQuery.andWhere('address.district = :districtId', {
        districtId: filterYellowPagesInput.district,
      });
    }

    if (filterYellowPagesInput.is_emergency) {
      sqlQuery.andWhere('phone_number.is_emergency = :isEmergency', {
        isEmergency: filterYellowPagesInput.is_emergency,
      });
    }

    if (filterYellowPagesInput.searchQuery) {
      const formattedQuery = filterYellowPagesInput.searchQuery
        .trim()
        .replace(/ /g, ' & ');
      sqlQuery.andWhere(
        `to_tsvector(coalesce(yellowpages.name, ' ')) || to_tsvector(coalesce(category.name, ' ')) @@ to_tsquery(:query)`,
        {
          query: `${formattedQuery}:*`,
        },
      );
    }

    const queryOut = await sqlQuery
      .take(limit)
      .skip(offset)
      .orderBy('yellowpages.createdAt', 'DESC')
      .getManyAndCount();
    return queryOut;
  }

  async adminFindAll(
    args: FetchPaginationArgs,
    filterYellowPagesInput: FilterYellowPagesInput,
  ): Promise<[YellowPages[], number]> {
    const whereOptions: any = {};

    if (filterYellowPagesInput.category) {
      whereOptions.category = { id: filterYellowPagesInput.category };
    }
    return await this.yellowPagesRepository.findAndCount({
      relations: ['address', 'phone_number', 'category', 'email'],
      where: { ...whereOptions },
      take: args.take,
      skip: args.skip,
    });
  }

  async get_file_path(yellowpagesInput): Promise<string> {
    const imageFile: any = await yellowpagesInput.singleImage;
    const img_ext = imageFile.filename.split('.').pop();
    const original_filename = imageFile.filename.split('.')[0];
    const file_name = `${
      yellowpagesInput.id
    }-${original_filename}-${new Date()}.${img_ext}`;

    const upload_dir = this.uploadDir;
    const file_path = await uploadFileStream(
      imageFile.createReadStream,
      upload_dir,
      file_name,
    );

    return file_path;
  }

  async create(
    yellowpagesInput: CreateYellowPagesInput,
    user: number,
  ): Promise<YellowPages> {
    let yellowpagesInputData: any = {
      ...yellowpagesInput,
      singleImage: null,
      address: null,
      phone_number: null,
      email: null,
    };

    if (yellowpagesInput.category) {
      const yellowPagesCategoryData: YellowPagesCatgory =
        await this.yellowPagesCategoryeRepository.findOneBy({
          id: yellowpagesInput.category,
        });

      if (!yellowPagesCategoryData) {
        throw new NotFoundException(
          `Yellow Pages category with id ${yellowpagesInput.category} not found`,
        );
      }
      yellowpagesInputData = {
        ...yellowpagesInputData,
        category: yellowPagesCategoryData,
      };
    }

    if (yellowpagesInput.state) {
      yellowpagesInputData = {
        ...yellowpagesInputData,
        state: yellowpagesInput.state,
      };
    }

    const yellowpagesData: YellowPages = await this.yellowPagesRepository.save({
      ...yellowpagesInputData,
      createdBy: user,
      updatedBy: user,
    });

    if (yellowpagesInput.singleImage) {
      const file_path: string = await this.get_file_path({
        ...yellowpagesInput,
        id: yellowpagesData.id,
      });
      yellowpagesData.singleImage = file_path;
      await this.yellowPagesRepository.save(yellowpagesData);
    }

    await Promise.all(
      yellowpagesInput.phone_number.map(async (phone_number) => {
        await this.yellowPagesPhoneNumberRepository.save({
          ...phone_number,
          yellowpages: yellowpagesData,
        });
      }),
    );

    if (yellowpagesInput.address) {
      await Promise.all(
        yellowpagesInput.address.map(async (address) => {
          const district: District = await this.districtRepository.findOne({
            where: { id: address.district },
            relations: ['province'],
          });
          if (!district) {
            throw new NotFoundException(
              `District with id ${address.district} not found`,
            );
          }
          const province: Province = await this.provinceRepository.findOneBy({
            id: address.province,
          });
          if (!province) {
            throw new NotFoundException(
              `Province with id ${address.province} not found`,
            );
          }
          if (district.province?.id == province.id) {
            let addressInput = {
              district: district,
              province: province,
              address: address.address,
              yellowpages: yellowpagesData,
            };
            await this.yellowPagesAddressRepository.save({ ...addressInput });
          } else {
            throw new NotFoundException(
              `District ${district.name} is not valid for province ${province.name}`,
            );
          }
        }),
      );
    }

    if (yellowpagesInput.email) {
      await Promise.all(
        yellowpagesInput.email.map(async (email) => {
          await this.yellowPagesEmailRepository.save({
            ...email,
            yellowpages: yellowpagesData,
          });
        }),
      );
    }
    return this.findOne(yellowpagesData.id);
  }

  async findOne(id: number): Promise<YellowPages> {
    const yellowpages = await this.yellowPagesRepository.findOne({
      where: { id: id },
      relations: ['address', 'phone_number', 'category', 'email'],
    });
    if (!yellowpages) {
      throw new NotFoundException(`Yellow Pages with id ${id} not found`);
    }
    return yellowpages;
  }

  async update(
    id: number,
    updateYellowPagesInput: UpdateYellowPagesInput,
    user: number,
  ): Promise<YellowPages> {
    const yellowpages: YellowPages = await this.findOne(id);

    let yellowPagesInputData: any = {
      ...updateYellowPagesInput,
    };

    const category_id = updateYellowPagesInput.category;

    if (category_id) {
      const category = await this.yellowPagesCategoryeRepository.findOneOrFail({
        where: { id: category_id },
      });

      if (!category) {
        throw new NotFoundException(
          `Yellow Pages category with id ${category_id} not found`,
        );
      }

      yellowPagesInputData = {
        ...yellowPagesInputData,
        category: category,
      };
    }

    if (updateYellowPagesInput.singleImage) {
      const file_path: string = await this.get_file_path({
        ...updateYellowPagesInput,
        id: yellowpages.id,
      });

      if (file_path) {
        await this.removeImage(id, user);
        yellowPagesInputData = {
          ...yellowPagesInputData,
          singleImage: file_path,
        };
        yellowpages.singleImage = file_path;
      }
    }

    await this.yellowPagesRepository.update(id, {
      ...yellowPagesInputData,
      updatedBy: user,
      publishedAt:
        yellowpages.publishedAt ||
        (updateYellowPagesInput.state === YellowPagesPublishState.PUBLISHED
          ? new Date()
          : null),
    });

    return await this.findOne(id);
  }

  async removeImage(id: number, user: number): Promise<YellowPages> {
    const yellowpages: YellowPages = await this.yellowPagesRepository.findOne({
      where: { id: id },
    });
    if (yellowpages.singleImage) {
      await this.fileService.removeFile(yellowpages.singleImage);
      yellowpages.singleImage = null;
      await this.yellowPagesRepository.save(yellowpages);
    }
    return yellowpages;
  }

  async remove(id: number, user: number) {
    const yellowpages: YellowPages = await this.findOne(id);

    if (
      yellowpages.state == YellowPagesPublishState.DRAFT &&
      yellowpages.createdBy == user
    ) {
      const removedYellowPages = this.yellowPagesRepository.remove(yellowpages);
      this.removeImage(id, user);
      return {
        id,
        ...removedYellowPages,
      };
    }
    throw new ForbiddenException(
      `Yellow pages with id ${id} cannot be deleted`,
    );
  }
}

@Injectable()
export class YellowPagesCategoryService {
  constructor(
    @InjectRepository(YellowPagesCatgory)
    private yellowPagesCategoryRepository: Repository<YellowPagesCatgory>,
  ) {}

  async create(
    yellowpagesCategoryInput: CreateYellowPagesCategoryInput,
    user: number,
  ): Promise<YellowPagesCatgory> {
    return await this.yellowPagesCategoryRepository.save({
      ...yellowpagesCategoryInput,
      createdBy: user,
      updatedBy: user,
    });
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<[YellowPagesCatgory[], number]> {
    return this.yellowPagesCategoryRepository.findAndCount({
      take: limit,
      skip: offset,
    });
  }

  async adminFindAll(args: FetchPaginationArgs): Promise<YellowPagesCatgory[]> {
    return await this.yellowPagesCategoryRepository.find({
      take: args.take,
      skip: args.skip,
    });
  }

  async findOne(id: number): Promise<YellowPagesCatgory> {
    const yellowpagesCategory: YellowPagesCatgory =
      await this.yellowPagesCategoryRepository.findOne({
        where: { id: id },
      });
    if (!yellowpagesCategory) {
      throw new NotFoundException(
        `Yellow Pages category with id ${id} not found`,
      );
    }
    return yellowpagesCategory;
  }

  async update(
    id: number,
    updateYellowPagesCategoryInput: UpdateYellowPagesCategoryInput,
  ) {
    const yellowPagesCategory = await this.findOne(id);
    if (yellowPagesCategory) {
      return await this.yellowPagesCategoryRepository.save({
        ...yellowPagesCategory,
        ...updateYellowPagesCategoryInput,
      });
    }
  }

  async remove(id: number): Promise<YellowPagesCatgory> {
    const yellowpagesCategory: YellowPagesCatgory = await this.findOne(id);

    if (yellowpagesCategory) {
      const removedYellowPagesCategory =
        this.yellowPagesCategoryRepository.remove(yellowpagesCategory);

      return {
        id,
        ...removedYellowPagesCategory,
      };
    }
  }
}

@Injectable()
export class YellowPagesAddressService {
  constructor(
    @InjectRepository(YellowPagesAddress)
    private readonly addressRepository: Repository<YellowPagesAddress>,
    @InjectRepository(YellowPages)
    private readonly yellowPagesRepository: Repository<YellowPages>,
  ) {}

  async create(
    addressInput: CreateYellowPagesAddressInput,
  ): Promise<YellowPagesAddress> {
    let addressInputData: any = {
      ...addressInput,
    };

    if (addressInput.yellowpages) {
      const yellowPages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: addressInput.yellowpages,
        });

      if (!yellowPages) {
        throw new NotFoundException(
          `Yellow pages with id ${addressInput.yellowpages} not found`,
        );
      }
      addressInputData = {
        ...addressInputData,
        yellowpages: yellowPages,
      };
    }
    return await this.addressRepository.save({
      ...addressInputData,
    });
  }

  async findAll(): Promise<YellowPagesAddress[]> {
    return this.addressRepository.find({
      relations: ['district', 'province'],
    });
  }

  async findOne(id: number): Promise<YellowPagesAddress> {
    const yellowpagesAddress: YellowPagesAddress =
      await this.addressRepository.findOne({
        where: { id: id },
        relations: ['district', 'province'],
      });
    if (!yellowpagesAddress) {
      throw new NotFoundException(
        `Yellow Pages address with id ${id} not found`,
      );
    }
    return yellowpagesAddress;
  }

  async update(
    id: number,
    updateYellowPagesAddressInput: UpdateYellowPagesAddressInput,
  ): Promise<YellowPagesAddress> {
    let addressInputData: any = {
      ...updateYellowPagesAddressInput,
    };
    const yellowpagesAddress: YellowPagesAddress = await this.findOne(id);

    if (!yellowpagesAddress) {
      throw new NotFoundException(
        `Yellow Pages address with id ${id} not found`,
      );
    }
    if (updateYellowPagesAddressInput.yellowpages) {
      const yellowPages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: updateYellowPagesAddressInput.yellowpages,
        });

      if (!yellowPages) {
        throw new NotFoundException(
          `Yellow pages with id ${updateYellowPagesAddressInput.yellowpages} not found`,
        );
      }

      addressInputData = {
        ...addressInputData,
        yellowpages: yellowPages,
      };
    }
    await this.addressRepository.update(id, { ...addressInputData });
    return this.addressRepository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: number): Promise<YellowPagesAddress> {
    const yellowpagesAddress: YellowPagesAddress =
      await this.addressRepository.findOne({
        where: { id: id },
      });

    if (yellowpagesAddress) {
      const removedYellowPagesAddress =
        this.addressRepository.remove(yellowpagesAddress);
      return {
        id,
        ...removedYellowPagesAddress,
      };
    }
    throw new NotFoundException(`Yellow Pages Address with id ${id} not found`);
  }

  async findDistrictofAddress(addressId: number) {
    const address: YellowPagesAddress = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['district'],
    });
    if (address) {
      return address.district;
    }
    return new NotFoundException(
      `Yellow page address with id ${addressId} not found`,
    );
  }

  async findProvinceofAddress(addressId: number) {
    const address: YellowPagesAddress = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['province'],
    });
    if (address) {
      return address.province;
    }
    return new NotFoundException(
      `Yellow page address with id ${addressId} not found`,
    );
  }
}

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(provinceInput: CreateProvinceInput): Promise<Province> {
    return await this.provinceRepository.save(provinceInput);
  }

  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({});
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id: id },
    });

    if (!province) {
      throw new NotFoundException(`Province with id ${id} not found`);
    }
    return province;
  }

  async update(
    id: number,
    updateProvinceInput: UpdateProvinceInput,
  ): Promise<Province> {
    const province: Province = await this.findOne(id);

    await this.provinceRepository.update(id, updateProvinceInput);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const province: Province = await this.provinceRepository.findOne({
      where: { id: id },
    });

    if (province) {
      await this.provinceRepository.delete(id);
      return province;
    }

    throw new NotFoundException(`Province with id ${id} not found`);
  }
}

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(districtInput: CreateDistrictInput): Promise<District> {
    let districtInputData: any = {
      ...districtInput,
    };

    const provinceID = districtInput.province;

    if (provinceID) {
      const province: Province = await this.provinceRepository.findOne({
        where: { id: provinceID },
      });

      if (!province) {
        throw new NotFoundException(`Province with id ${provinceID} not found`);
      }

      districtInputData = {
        ...districtInputData,
        province: province,
      };
    }
    return await this.districtRepository.save({ ...districtInputData });
  }

  async findAll(filterDistrictInput: FilterDistrictInput): Promise<District[]> {
    const sqlQuery = this.districtRepository
      .createQueryBuilder('district')
      .leftJoinAndSelect('district.province', 'province');

    if (filterDistrictInput.province) {
      sqlQuery.andWhere('district.province = :province', {
        province: filterDistrictInput.province,
      });
    }

    if (filterDistrictInput.searchQuery) {
      const formattedQuery = filterDistrictInput.searchQuery
        .trim()
        .replace(/ /g, ' & ');
      sqlQuery.andWhere(
        `to_tsvector(coalesce(district.name, ' ')) || to_tsvector(coalesce(province.name, ' ')) @@ to_tsquery(:query)`,
        {
          query: `${formattedQuery}:*`,
        },
      );
    }
    const queryOut = await sqlQuery.getMany();
    return queryOut;
  }

  async update(
    id: number,
    updateDistrictInput: UpdateDistrictInput,
  ): Promise<District> {
    let districtInputData: any = {
      ...updateDistrictInput,
    };
    const district: District = await this.districtRepository.findOne({
      where: { id },
    });

    if (!district) {
      throw new NotFoundException(`District with id ${id} not found`);
    }
    if (updateDistrictInput.province) {
      const province: Province = await this.provinceRepository.findOneBy({
        id: updateDistrictInput.province,
      });
      if (!province) {
        throw new NotFoundException(
          `Province with id ${updateDistrictInput.province} not found`,
        );
      }
      districtInputData = {
        ...districtInputData,
        province: province,
      };
    }
    await this.districtRepository.update(id, { ...districtInputData });

    return this.districtRepository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: number) {
    const district: District = await this.districtRepository.findOne({
      where: { id: id },
    });

    if (district) {
      await this.districtRepository.delete(id);
      return district;
    }

    throw new NotFoundException(`District with id ${id} not found`);
  }
}

@Injectable()
export class YellowPagesPhoneNumberService {
  constructor(
    @InjectRepository(YellowPagesPhoneNumber)
    private readonly phoneNumberRepository: Repository<YellowPagesPhoneNumber>,
    @InjectRepository(YellowPages)
    private readonly yellowPagesRepository: Repository<YellowPages>,
  ) {}

  async create(
    phoneNumberInput: CreateYellowPagesPhoneNumberInput,
  ): Promise<YellowPagesPhoneNumber> {
    let phoneNumberInputData: any = {
      ...phoneNumberInput,
    };

    if (phoneNumberInput.yellowpages) {
      const yellowPages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: phoneNumberInput.yellowpages,
        });
      if (!yellowPages) {
        throw new NotFoundException(
          `Yellow pages with id ${phoneNumberInput.yellowpages} not found`,
        );
      }

      phoneNumberInputData = {
        ...phoneNumberInputData,
        yellowpages: yellowPages,
      };
    }

    return await this.phoneNumberRepository.save({
      ...phoneNumberInputData,
    });
  }

  async findAll(): Promise<YellowPagesPhoneNumber[]> {
    return await this.phoneNumberRepository.find({});
  }

  async findOne(id: number) {
    const yellowPagesPhoneNumber: YellowPagesPhoneNumber =
      await this.phoneNumberRepository.findOne({
        where: { id: id },
      });
    if (!yellowPagesPhoneNumber) {
      throw new NotFoundException(
        `Yellow Pages address with id ${id} not found`,
      );
    }
    return yellowPagesPhoneNumber;
  }

  async update(
    id: number,
    updateYellowPagesPhoneNumberInput: UpdateYellowPagesPhoneNumberInput,
  ): Promise<YellowPagesPhoneNumber> {
    let phoneNumberInputData: any = {
      ...updateYellowPagesPhoneNumberInput,
    };

    const yellowpagesPhoneNumber: YellowPagesPhoneNumber = await this.findOne(
      id,
    );
    if (updateYellowPagesPhoneNumberInput.yellowpages) {
      const yellowPages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: updateYellowPagesPhoneNumberInput.yellowpages,
        });
      if (!yellowPages) {
        throw new NotFoundException(
          `Yellow pages with id ${updateYellowPagesPhoneNumberInput.yellowpages} not found`,
        );
      }
      phoneNumberInputData = {
        ...phoneNumberInputData,
        yellowpages: yellowPages,
      };
    }
    this.phoneNumberRepository.update(id, { ...phoneNumberInputData });

    return this.phoneNumberRepository.findOneOrFail({ where: { id: id } });
  }

  async remove(id: number) {
    const yellowPagesPhoneNumber: YellowPagesPhoneNumber = await this.findOne(
      id,
    );

    if (yellowPagesPhoneNumber) {
      const removedYellowPagesPhoneNumbers = this.phoneNumberRepository.remove(
        yellowPagesPhoneNumber,
      );
      return {
        id,
        ...removedYellowPagesPhoneNumbers,
      };
    }
    throw new NotFoundException(`Yellow Pages Address with id ${id} not found`);
  }
}

@Injectable()
export class YellowPagesEmailService {
  constructor(
    @InjectRepository(YellowPagesEmail)
    private readonly emailRepository: Repository<YellowPagesEmail>,
    @InjectRepository(YellowPages)
    private readonly yellowPagesRepository: Repository<YellowPages>,
  ) {}

  async create(
    emailInput: CreateYellowPagesEmailInput,
  ): Promise<YellowPagesEmail> {
    let emailInputData: any = {
      ...emailInput,
    };

    if (emailInput.yellowpages) {
      const yellowpages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: emailInput.yellowpages,
        });
      if (!yellowpages) {
        throw new NotFoundException(
          `Yellow pages with id ${emailInput.yellowpages} not found`,
        );
      }
      emailInputData = {
        ...emailInputData,
        yellowpages: yellowpages,
      };
    }

    return await this.emailRepository.save({
      ...emailInputData,
    });
  }

  async findAll(): Promise<YellowPagesEmail[]> {
    return await this.emailRepository.find({});
  }

  async findOne(id: number): Promise<YellowPagesEmail> {
    const yellowPagesEmail: YellowPagesEmail =
      await this.emailRepository.findOne({
        where: { id: id },
      });
    if (!yellowPagesEmail) {
      throw new NotFoundException(`Yellow pages email with id ${id} not found`);
    }

    return yellowPagesEmail;
  }

  async update(
    id: number,
    updateYellowPagesEmailInput: UpdateYellowPagesEmailInput,
  ): Promise<YellowPagesEmail> {
    let emailInputData: any = {
      ...updateYellowPagesEmailInput,
    };

    const yellowPagesEmail: YellowPagesEmail = await this.findOne(id);
    if (updateYellowPagesEmailInput.yellowpages) {
      const yellowpages: YellowPages =
        await this.yellowPagesRepository.findOneBy({
          id: updateYellowPagesEmailInput.yellowpages,
        });
      if (!yellowpages) {
        throw new NotFoundException(`Yellow pages with id ${id} not found`);
      }
      emailInputData = {
        ...emailInputData,
        yellowpages: yellowpages,
      };
    }
    this.emailRepository.update(id, { ...emailInputData });
    return this.emailRepository.findOneOrFail({
      where: { id: id },
      relations: ['yellowpages'],
    });
  }

  async remove(id: number) {
    const yellowPagesEmail: YellowPagesEmail = await this.findOne(id);
    const removedYellowPagesEmail =
      this.emailRepository.remove(yellowPagesEmail);

    return {
      id,
      ...removedYellowPagesEmail,
    };
  }
}
