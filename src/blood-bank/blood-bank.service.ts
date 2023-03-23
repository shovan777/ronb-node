import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDistrict, BaseProvince } from 'src/common/entities/base.entity';
import { BloodGroup } from 'src/common/enum/bloodGroup.enum';
import { PublishState as BloodRequestState } from 'src/common/enum/publish_state.enum';
import { calculateUserAge } from 'src/common/utils/calculateUserAge';
import { checkIfObjectIsPublished } from 'src/common/utils/checkPublishedState';
import { Author } from 'src/users/entitiy/users.entity';
import { getAuthor } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';
import { MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateBloodRequestInput } from './dto/create-blood-bank.input';
import { UpdateBloodRequestInput } from './dto/update-blood-bank.input';
import {
  BloodRequest,
  BloodRequestAddress,
} from './entities/blood-bank.entity';

@Injectable()
export class BloodBankService {
  constructor(
    @InjectRepository(BloodRequest)
    private bloodRequestRepository: Repository<BloodRequest>,
    @InjectRepository(BloodRequestAddress)
    private bloodRequestAddressRepository: Repository<BloodRequestAddress>,
    @InjectRepository(BaseDistrict)
    private districtRepository: Repository<BaseDistrict>,
    @InjectRepository(BaseProvince)
    private provinceRepository: Repository<BaseProvince>,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async findAll(user: number): Promise<BloodRequest[]> {
    const userDetails: Author = await getAuthor(this.userService, user);

    if (userDetails.profile.bloodGroupApproval) {
      let whereOptions: any = {
        createdBy: Not(user),
        state: BloodRequestState.PUBLISHED,
        donationDate: MoreThanOrEqual(new Date()),
      };

      if (userDetails.profile.bloodGroup == BloodGroup.DONT_KNOW) {
        whereOptions = {
          ...whereOptions,
        };
      } else {
        whereOptions = {
          ...whereOptions,
          bloodGroup: userDetails.profile.bloodGroup,
        };
      }
      return this.bloodRequestRepository.find({
        relations: ['address'],
        where: {
          ...whereOptions,
        },
      });
    }

    throw new ForbiddenException(
      `User has not accepted the approval for blood donation.`,
    );
  }

  async findMyRequest(user): Promise<BloodRequest[]> {
    const userDetails = await this.userService.findOne(user);

    if (userDetails.profile.blood_group_approval) {
      return this.bloodRequestRepository.find({
        relations: ['address'],
        where: {
          createdBy: user,
        },
      });
    }

    throw new ForbiddenException(
      `User has not accepted the approval for blood donation.`,
    );
  }

  async findOne(id: number): Promise<BloodRequest> {
    const bloodRequest: BloodRequest =
      await this.bloodRequestRepository.findOne({
        where: { id: id },
        relations: ['address'],
      });
    if (!bloodRequest) {
      throw new NotFoundException(`Blood request with id ${id} not found.`);
    }
    return bloodRequest;
  }

  async create(
    bloodBankInput: CreateBloodRequestInput,
    user: number,
  ): Promise<BloodRequest> {
    let bloodbankInputData: any = {
      ...bloodBankInput,
      address: null,
    };

    if (bloodBankInput.address) {
      const district = await this.districtRepository.findOne({
        where: { id: bloodBankInput.address.district },
      });
      if (!district) {
        throw new NotFoundException(
          `District with id ${bloodBankInput.address.district} not found.`,
        );
      }
      const province = await this.provinceRepository.findOneBy({
        id: bloodBankInput.address.province,
      });
      if (!province) {
        throw new NotFoundException(
          `Province with id ${bloodBankInput.address.province} not found.`,
        );
      }

      let addressInput = {
        district: district,
        province: province,
        address: bloodBankInput.address.address,
      };

      const address = await this.bloodRequestAddressRepository.save({
        ...addressInput,
      });

      bloodbankInputData = {
        ...bloodBankInput,
        address: address,
      };
    }

    const bloodBankData = await this.bloodRequestRepository.save({
      ...bloodbankInputData,
      createdBy: user,
      updatedBy: user,
    });

    return this.bloodRequestRepository.findOne({
      where: { id: bloodBankData.id },
    });
  }

  async update(
    id: number,
    updateBloodRequestInput: UpdateBloodRequestInput,
    user: number,
  ): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(id);

    if (bloodRequest.createdBy == user) {
      if (!checkIfObjectIsPublished(bloodRequest.state)) {
        let bloodRequestInputData: any = {
          ...updateBloodRequestInput,
        };
        await this.bloodRequestRepository.update(id, {
          ...bloodRequestInputData,
        });
        return await this.findOne(id);
      }
      throw new ForbiddenException(
        `Blood request cannot be edited once it is published.`,
      );
    } else {
      throw new ForbiddenException(
        `User is not authorized to update the blood request with id ${id}.`,
      );
    }
  }

  async remove(id: number, user: number) {
    const bloodRequest: BloodRequest = await this.findOne(id);

    if (bloodRequest.createdBy == user) {
      if (!checkIfObjectIsPublished(bloodRequest.state)) {
        const removedBloodRequest =
          this.bloodRequestRepository.remove(bloodRequest);
        return {
          id,
          ...removedBloodRequest,
        };
      }
      throw new ForbiddenException(
        `Blood request cannot be edited once it is published.`,
      );
    } else {
      throw new ForbiddenException(
        `User is not authorized to delete the blood request with id ${id}.`,
      );
    }
  }

  async acceptRequest(
    requestID: number,
    userID: number,
  ): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(requestID);
    const userDetails = await getAuthor(this.userService, userID);

    if (!userDetails.profile.bloodGroupApproval)
      throw new ForbiddenException(
        `User has not accepted the approval for blood donation.`,
      );

    const userAge = calculateUserAge(userDetails.profile.dateOfBirth);
    if (userAge < 18 || userAge > 60)
      throw new ForbiddenException(
        `User with id ${userID} do not have valid age for donation.`,
      );

    if (bloodRequest.acceptors.includes(userID)) {
      throw new ForbiddenException(
        `User with id ${userID} has already accepted this blood request.`,
      );
    } else {
      bloodRequest.acceptors.push(userID);
      return await this.bloodRequestRepository.save(bloodRequest);
    }
  }

  async getAcceptors(requestID: number) {
    const bloodRequest: BloodRequest = await this.findOne(requestID);

    const acceptorsList = bloodRequest.acceptors;
    let acc = [];

    await Promise.all(
      acceptorsList.map(async (each) => {
        const userDetails = await getAuthor(this.userService, each);
        acc.push(userDetails);
      }),
    );

    return acc;
  }
}
