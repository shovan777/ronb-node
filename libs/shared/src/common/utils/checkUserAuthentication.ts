import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

export const checkUserAuthenticated = (user: number) => {
  console.log(`user ${user} is commenting`);
  if (!user) {
    throw new UnauthorizedException('User not logged in');
  }
};

export const checkUserIsAuthor = (user: number, author: number) => {
  if (user !== author) {
    throw new ForbiddenException(`${user} is not the author`);
  }
};
