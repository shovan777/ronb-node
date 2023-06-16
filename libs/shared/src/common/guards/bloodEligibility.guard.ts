import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'apps/ronb-node/src/users/users.service';
import { Observable } from 'rxjs';
import { BloodGroup } from '../enum/bloodGroup.enum';

export class BloodRequestForbiddenException extends HttpException {
  constructor() {
    super('No access', HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class BloodEligibilityGuard implements CanActivate {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const { user } = ctx.getContext().req;
    const result = this.validateRequest(user.id);
    return result;
  }

  async validateRequest(userId: number): Promise<boolean> {
    const user = await this.userService.findOne(userId);

    if (!user) return false;
    if (
      !user.profile.blood_group_approval ||
      user.profile.blood_group == BloodGroup.DONT_KNOW
    ) {
      //   throw new BloodRequestForbiddenException();
      return false;
    }
    return true;
  }
}
