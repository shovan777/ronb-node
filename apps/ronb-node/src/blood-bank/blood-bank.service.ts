import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  BaseDistrict,
  BaseProvince,
} from '@app/shared/entities/address.entity';
import { BloodGroup } from '@app/shared/common/enum/bloodGroup.enum';
import { calculateUserAge } from '@app/shared/common/utils/calculateUserAge';
import { checkIfObjectIsPublished } from '@app/shared/common/utils/checkPublishedState';
import { Author } from '@app/shared/entities/users.entity';
import { getAuthor, getDoners } from '../users/users.resolver';
import { UsersService } from '../users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateBloodRequestInput } from './dto/create-blood-bank.input';
import { UpdateBloodRequestInput } from './dto/update-blood-bank.input';
import {
  BloodRequest,
  BloodRequestAddress,
  BloodRequestState,
} from '@app/shared/entities/blood-bank.entity';
import { DonerPaginateInterface } from '@app/shared/common/interfaces/user.interface';
import { BloodRecordResponse } from './blood-bank.response';
import { FilterBloodRequestInput } from './dto/filter-blood-group.input';
import { getDateInterval } from '@app/shared/common/utils/dateInterval';
import { removeIdFromArray } from '@app/shared/common/utils/utils';

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
    @InjectDataSource('default')
    private dataSource: DataSource,
    @InjectDataSource('usersConnection')
    private userDataSource: DataSource,
  ) {}

  async findAllAdmin(limit: number, offset: number) {
    const [queryOut, count] = await this.bloodRequestRepository.findAndCount({
      relations: ['address', 'address.province', 'address.district'],
      take: limit,
      skip: offset,
    });

    await Promise.all(
      queryOut.map(async (req) => {
        req.profile = await this.userDataSource
          .createQueryBuilder()
          .from('account_user', 'account_user')
          .where('account_user.id = :id', { id: req.createdBy })
          .getRawOne();
      }),
    );

    return { bloodRequest: queryOut, count: count };
  }

  async findAll(
    limit: number,
    offset: number,
    user: number,
    filterBloodRequestInput: FilterBloodRequestInput,
  ) {
    const userDetails: Author = await getAuthor(this.userService, user);

    const sqlQuery = this.bloodRequestRepository
      .createQueryBuilder('blood_request')
      .leftJoinAndSelect('blood_request.address', 'address')
      .leftJoinAndSelect('address.district', 'district')
      .leftJoinAndSelect('address.province', 'province');

    sqlQuery
      .where('blood_request.state = :state', {
        state: BloodRequestState.PUBLISHED,
      })
      .andWhere('blood_request.createdBy != :user', { user })
      .andWhere('blood_request.donationDate >= :today', {
        today: new Date(),
      })
      .andWhere('address.province = :userProvince', {
        userProvince: userDetails.address.province,
      });

    if (filterBloodRequestInput.filter) {
      sqlQuery.andWhere('blood_request.bloodGroup = :bloodGroup', {
        bloodGroup: filterBloodRequestInput.bloodGroup,
      });
    } else {
      sqlQuery.andWhere('blood_request.bloodGroup != :bloodGroup', {
        bloodGroup: userDetails.profile.bloodGroup,
      });
    }

    sqlQuery.orderBy('blood_request.is_emergency', 'DESC');
    sqlQuery.addOrderBy('blood_request.createdAt', 'DESC');

    const queryOut = await sqlQuery.take(limit).skip(offset).getManyAndCount();
    return queryOut;
  }

  async findMyRequest(user: number): Promise<BloodRequest[]> {
    return await this.bloodRequestRepository.find({
      relations: ['address', 'address.district', 'address.province'],
      where: {
        createdBy: user,
      },
      order: {
        state: 'ASC',
        createdAt: 'DESC',
        is_emergency: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<BloodRequest> {
    const bloodRequest: BloodRequest =
      await this.bloodRequestRepository.findOne({
        where: { id: id },
        relations: ['address', 'address.province', 'address.district'],
      });
    if (!bloodRequest) {
      throw new NotFoundException(`Blood request with id ${id} not found.`);
    } else {
      const donerDetails = await getAuthor(
        this.userService,
        bloodRequest.createdBy,
      );
      bloodRequest.profile = donerDetails;
    }
    return bloodRequest;
  }

  async findAndSaveAddress(
    bloodRequestInput: any,
  ): Promise<BloodRequestAddress> {
    const district = await this.districtRepository.findOne({
      where: { id: bloodRequestInput.district },
    });
    if (!district) {
      throw new NotFoundException(
        `District with id ${bloodRequestInput.district} not found.`,
      );
    }
    const province = await this.provinceRepository.findOneBy({
      id: bloodRequestInput.province,
    });
    if (!province) {
      throw new NotFoundException(
        `Province with id ${bloodRequestInput.province} not found.`,
      );
    }

    let addressInput = {
      district: district,
      province: province,
      address: bloodRequestInput.address,
    };
    return await this.bloodRequestAddressRepository.save({
      ...addressInput,
    });
  }

  private checkDonationDate(donationDate: Date): Boolean {
    const inputDate = new Date(donationDate);
    const utcDate = new Date(inputDate.toLocaleDateString());
    const donationDuration = getDateInterval(utcDate);

    if (donationDuration > 0) {
      return true;
    }
    return false;
  }

  async create(
    bloodBankInput: CreateBloodRequestInput,
    user: number,
  ): Promise<BloodRequest> {
    let bloodRequestData: any = {
      ...bloodBankInput,
      address: null,
    };

    const isEmergencyTimeInterval = 2; //in days

    if (bloodBankInput.donationDate) {
      const donationDate = bloodBankInput.donationDate;
      const donationDuration = getDateInterval(donationDate);

      if (!this.checkDonationDate(bloodBankInput.donationDate)) {
        throw new ForbiddenException(
          `Donation date must be selected from ${new Date()} or later.`,
        );
      }
      if (
        donationDuration <= isEmergencyTimeInterval &&
        donationDuration >= 0
      ) {
        bloodBankInput = {
          ...bloodBankInput,
          is_emergency: true,
        };
      } else {
        bloodRequestData = {
          ...bloodRequestData,
        };
      }
    }

    if (bloodBankInput.address) {
      const savedAddress = await this.findAndSaveAddress(
        bloodBankInput.address,
      );

      bloodRequestData = {
        ...bloodBankInput,
        address: savedAddress,
      };
    }

    const toSaveData = this.bloodRequestRepository.create({
      ...bloodRequestData,
      createdBy: user,
      updatedBy: user,
    } as Object);

    return await this.bloodRequestRepository.save(toSaveData);
  }

  async update(
    id: number,
    updateBloodRequestInput: UpdateBloodRequestInput,
    user: number,
  ): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(id);

    if (bloodRequest.createdBy == user) {
      if (!checkIfObjectIsPublished(bloodRequest.state)) {
        let bloodRequestData: any = {
          ...updateBloodRequestInput,
          address: bloodRequest.address,
        };
        const updatedDonationDate: Date = updateBloodRequestInput.donationDate;

        if (
          (updatedDonationDate &&
            !this.checkDonationDate(updatedDonationDate)) ||
          (!updatedDonationDate &&
            !this.checkDonationDate(bloodRequest.donationDate))
        ) {
          throw new ForbiddenException(
            `Donation date must be selected from ${new Date()} or later.`,
          );
        }
        //TODO: make separate services for address
        if (updateBloodRequestInput.address) {
          const savedAddress = await this.findAndSaveAddress(
            updateBloodRequestInput.address,
          );

          bloodRequestData = {
            ...bloodRequestData,
            address: savedAddress,
          };
        }

        const updatedBloodRequest = Object.assign(
          bloodRequest,
          bloodRequestData,
        );
        return await this.bloodRequestRepository.save(updatedBloodRequest);
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
        this.bloodRequestRepository.remove(bloodRequest);
        return bloodRequest;
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

    if (bloodRequest.createdBy !== userID) {
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
    } else {
      throw new ForbiddenException(`You cannot accept your own request`);
    }
  }

  async cancelAcceptedRequest(
    requestId: number,
    userId: number,
  ): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(requestId);
    const bloodRequestAcceptors = bloodRequest.acceptors;

    if (bloodRequestAcceptors.includes(userId)) {
      const updatedAcceptors = removeIdFromArray(bloodRequestAcceptors, userId);
      bloodRequest.acceptors = updatedAcceptors;

      return await this.bloodRequestRepository.save(bloodRequest);
    }

    throw new ForbiddenException(
      `User ${userId} is not on the list of acceptors for this bloodRequest`,
    );
  }

  async cancelBloodRequest(requestId: number): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(requestId);

    bloodRequest.state = BloodRequestState.CANCELLED;

    return await this.bloodRequestRepository.save(bloodRequest);
  }

  async completeRequest(requestId: number): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(requestId);

    bloodRequest.state = BloodRequestState.COMPLETE;

    return await this.bloodRequestRepository.save(bloodRequest);
  }

  async getAcceptors(requestID: number) {
    const bloodRequest: BloodRequest = await this.findOne(requestID);

    const acceptorsList = bloodRequest.acceptors;
    let acceptors = [];

    await Promise.all(
      acceptorsList.map(async (each) => {
        const userDetails = await getAuthor(this.userService, each);
        acceptors.push(userDetails);
      }),
    );

    return acceptors;
  }

  async getDoners(requestID: number) {
    const bloodRequest: BloodRequest = await this.findOne(requestID);

    const acceptorsList = bloodRequest.doners;
    let doners = [];

    await Promise.all(
      acceptorsList.map(async (each) => {
        const userDetails = await getAuthor(this.userService, each);
        doners.push(userDetails);
      }),
    );

    return doners;
  }

  async addDoners(requestID: number, donerId: [number]): Promise<BloodRequest> {
    const bloodRequest: BloodRequest = await this.findOne(requestID);

    donerId.forEach((id) => {
      if (bloodRequest.doners.includes(id)) {
        throw new ForbiddenException(
          `User with id ${donerId} is already added as a doner`,
        );
      } else {
        bloodRequest.doners.push(id);
        bloodRequest.donatedDate = new Date();
      }
    });

    bloodRequest.state = BloodRequestState.COMPLETE;

    return await this.bloodRequestRepository.save(bloodRequest);
  }

  async findAllDoners(
    limit: number,
    offset: number,
  ): Promise<DonerPaginateInterface> {
    const users: DonerPaginateInterface = await getDoners(
      limit,
      offset,
      this.userService,
      this.bloodRequestRepository,
    );
    return users;
  }

  async bloodRecords(): Promise<BloodRecordResponse> {
    const bloodRequestCompleted =
      await this.bloodRequestRepository.findAndCount({
        where: {
          state: BloodRequestState.COMPLETE,
        },
      });

    const totalDonation = bloodRequestCompleted[0].reduce(
      (acc, currentValue) => {
        const filteredDoners = currentValue.doners.filter(
          (item) => item !== -1,
        );
        return acc + filteredDoners.length;
      },
      0,
    );

    const bloodRequestPublished =
      await this.bloodRequestRepository.findAndCount({
        where: {
          state: BloodRequestState.PUBLISHED,
        },
      });

    const totalRequest = bloodRequestPublished[1];
    return { totalDonation: totalDonation, totalRequest: totalRequest };
  }
}
