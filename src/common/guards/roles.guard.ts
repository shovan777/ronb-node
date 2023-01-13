/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, ctx.getHandler());
    if (!requiredRoles || isPublic) {
      return true;
    }

    const { user } = ctx.getContext().req;
    console.log('user', user)
    // console.log(user, requiredRoles);

    return requiredRoles.some((role) => user.role === role);
  }
}
