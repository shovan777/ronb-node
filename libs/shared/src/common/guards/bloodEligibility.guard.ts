import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BloodGroup } from '../enum/bloodGroup.enum';

export class BloodRequestForbiddenException extends HttpException {
  constructor() {
    super('No access', HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class BloodEligibilityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const { user } = ctx.getContext().req;

    if (!user) return false;
    if (!user.bloodApproval && user.bloodGroup == BloodGroup.DONT_KNOW) {
      //   throw new BloodRequestForbiddenException();
      return false;
    }
    return true;
  }
}
