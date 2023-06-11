import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const newsDateMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let date: Date | string = await next();
  if (date && !(date instanceof Date)) {
    date = new Date(date);
  }
  return date;
};
