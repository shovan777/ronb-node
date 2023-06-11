import { BloodRequest } from '@app/shared/entities/blood-bank.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PublishState } from '../enum/publish_state.enum';

export class BloodRequestCreateLimit implements CanActivate {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
  ) {}

  userCreateRequestLimit = 10;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const userActiveBloodReq = await this.bloodRequestRepository.find({
      where: {
        createdBy: user.id,
        donationDate: MoreThanOrEqual(new Date()),
        state: PublishState.PUBLISHED,
      },
    });

    if (userActiveBloodReq.length < this.userCreateRequestLimit) return true;
    throw new ForbiddenException(
      `User cannot have more than ${this.userCreateRequestLimit} active requests.`,
    );
  }
}

export class BloodRequestAcceptLimit implements CanActivate {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
  ) {}

  userAcceptLimit = 10;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    let acceptorList = [];
    const bloodRequest = await this.bloodRequestRepository.find({
      where: {
        donationDate: MoreThanOrEqual(new Date()),
        state: PublishState.PUBLISHED,
      },
    });

    bloodRequest.forEach((each) => {
      acceptorList.push(...each.acceptors);
    });

    const count = acceptorList.reduce(
      (acc, num) => (num === user.id ? acc + 1 : acc),
      1,
    );

    if (count > this.userAcceptLimit) {
      throw new ForbiddenException(
        `User cannot accept more than ${this.userAcceptLimit} active requests.`,
      );
    }
    return true;
  }
}
