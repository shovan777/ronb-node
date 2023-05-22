import { BloodRequest } from '@app/shared/entities/blood-bank.entity';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { BloodGroup } from '../enum/bloodGroup.enum';
import { PublishState } from '../enum/publish_state.enum';

export class BloodRequestCreateLimit implements CanActivate {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const userActiveBloodReq = await this.bloodRequestRepository.findOne({
      where: {
        createdBy: user.id,
        donationDate: MoreThanOrEqual(new Date()),
        state: PublishState.PUBLISHED,
      },
    });

    if (!userActiveBloodReq) return true;
    return false;
  }
}

export class BloodRequestAcceptLimit implements CanActivate {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
  ) {}

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

    if (
      acceptorList.includes(user.id) ||
      user.blood_group == BloodGroup.DONT_KNOW
    ) {
      return false;
    }
    return true;
  }
}
