import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  YellowPages,
  YellowPagesCatgory,
  YellowPagesAddress,
  YellowPagesPhoneNumber,
} from './entities/yellow-pages.entity';

@Injectable()
export class YellowPagesService {
  constructor(
    @InjectRepository(YellowPages)
    private yellowPagesRepository: Repository<YellowPages>,
    @InjectRepository(YellowPagesCatgory)
    private yellowPagesCategoryeRepository: Repository<YellowPagesCatgory>,
  ) {}

  async findAll(): Promise<YellowPages[]> {
    return this.yellowPagesRepository.find({
      relations: ['address', 'phone_number', 'category'],
    });
  }

  async create(yellowpagesInput: CreateYellowPagesInput): Promise<YellowPages> {
    let yellowpagesInputData: any = {
      ...yellowpagesInput,
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

    const yellowpagesData = await this.yellowPagesRepository.save({
      ...yellowpagesInputData,
    });

    return yellowpagesData;
  }

  async findOne(id: number) {
    const yellowpages = await this.yellowPagesRepository.findOne({
      where: { id: id },
      relations: ['address', 'phone_number', 'category'],
    });
    if (!yellowpages) {
      throw new NotFoundException(`Yellow Pages with id ${id} not found`);
    }
    return yellowpages;
  }

  async update(
    id: number,
    updateYellowPagesInput: UpdateYellowPagesInput,
  ): Promise<YellowPages> {
    const yellowpages: YellowPages = await this.findOne(id);
    if (!yellowpages) {
      throw new NotFoundException(`Yellow Pages with id ${id} not found`);
    }
    console.log('yellowpages', yellowpages);
    return await this.yellowPagesRepository.save({
      ...yellowpages,
      updateYellowPagesInput,
    });
  }

  async remove(id: number) {
    const yellowpages: YellowPages = await this.yellowPagesRepository.findOne({
      where: { id: id },
    });

    if (yellowpages) {
      const removedYellowPages = this.yellowPagesRepository.remove(yellowpages);
      return {
        id,
        ...removedYellowPages,
      };
    }
    throw new NotFoundException(`Yellow Pages with id ${id} not found`);
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
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user,
      updatedBy: user,
    });
  }

  async findAll(): Promise<YellowPagesCatgory[]> {
    return this.yellowPagesCategoryRepository.find({
      relations: ['yellowpages'],
    });
  }

  async findOne(id: number): Promise<YellowPagesCatgory> {
    const yellowpagesCategory: YellowPagesCatgory =
      await this.yellowPagesCategoryRepository.findOne({
        where: { id: id },
        relations: ['yellowpages'],
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
    throw new NotFoundException(
      `Yellow Pages category with id ${id} not found`,
    );
  }

  async remove(id: number): Promise<YellowPagesCatgory> {
    const yellowpagesCategory: YellowPagesCatgory =
      await this.yellowPagesCategoryRepository.findOne({
        where: { id: id },
      });

    if (yellowpagesCategory) {
      const removedYellowPagesCategory =
        this.yellowPagesCategoryRepository.remove(yellowpagesCategory);

      return {
        id,
        ...removedYellowPagesCategory,
      };
    }
    throw new NotFoundException(
      `Yellow Pages category with id ${id} not found`,
    );
  }
}

@Injectable()
export class YellowPagesAddressService {
  constructor(
    @InjectRepository(YellowPagesAddress)
    private addressRepository: Repository<YellowPagesAddress>,
    @InjectRepository(YellowPagesAddress)
    private yellowPagesRepository: Repository<YellowPages>,
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
    return this.addressRepository.find({ relations: ['yellowpages'] });
  }

  async findOne(id: number): Promise<YellowPagesAddress> {
    const yellowpagesAddress: YellowPagesAddress =
      await this.addressRepository.findOne({
        where: { id: id },
        relations: ['yellowpages'],
      });
    if (!yellowpagesAddress) {
      throw new NotFoundException(
        `Yellow Pages address with id ${id} not found`,
      );
    }
    return yellowpagesAddress;
  }

  // async update(
  //   id: number,
  //   updateYellowPagesAddressInput: UpdateYellowPagesAddressInput,
  // ): Promise<YellowPagesAddress> {
  //   const yellowpagesAddress: YellowPagesAddress = await this.findOne(id);
  //   if (!yellowpagesAddress) {
  //     throw new NotFoundException(
  //       `Yellow Pages address with id ${id} not found`,
  //     );
  //   }
  //   console.log('yellowpagesAddress', yellowpagesAddress);
  //   console.log('yellowpagesAddress', updateYellowPagesAddressInput);
  //   return await this.addressRepository.save({
  //     ...yellowpagesAddress,
  //     ...updateYellowPagesAddressInput,
  //   });
  // }

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

    console.log('phoneNumberInputData', phoneNumberInputData);

    return await this.phoneNumberRepository.save({
      ...phoneNumberInputData,
    });
  }

  async findAll(): Promise<YellowPagesPhoneNumber[]> {
    return await this.phoneNumberRepository.find({
      relations: ['yellowpages'],
    });
  }

  async findOne(id: number) {
    const yellowPagesPhoneNumber: YellowPagesPhoneNumber =
      await this.phoneNumberRepository.findOne({
        where: { id: id },
        relations: ['yellowpages'],
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
    if (!yellowpagesPhoneNumber) {
      throw new NotFoundException(
        `Yellow Pages phone number with id ${id} not found`,
      );
    }

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
    return await this.yellowPagesRepository.save(phoneNumberInputData);
  }

  async remove(id: number) {
    const yellowPagesPhoneNumber: YellowPagesPhoneNumber =
      await this.phoneNumberRepository.findOne({
        where: { id: id },
      });

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
