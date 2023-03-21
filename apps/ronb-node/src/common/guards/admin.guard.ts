/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the gql context for gql
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // const request = context.switchToHttp().getRequest();
    if (!request.user.isAdmin) {
      return false;
    }
    return true;
  }
}
