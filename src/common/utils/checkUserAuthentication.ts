import { UnauthorizedException } from '@nestjs/common/exceptions';

export const checkUserAuthenticated = (user: number) => {
  if (!user) {
    console.log(user);
    throw new UnauthorizedException('User not logged in');
  }
};
