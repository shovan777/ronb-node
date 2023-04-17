import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { generateFileUrl } from '../utils/fileurl';

export const pathFinderMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let filePath: string = await next();
  let url =  generateFileUrl(filePath);
  return url;
};
