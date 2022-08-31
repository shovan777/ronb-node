import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const pathFinderMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  let filePath: string = await next();
  const use_s3 = process.env.USE_S3 === 'true';
  if (!filePath) {
    return filePath;
  }
  if (use_s3) {
    const bucket_name = process.env.BUCKET_NAME;
    const region = process.env.AWS_REGION;
    filePath = `https://${bucket_name}.s3.${region}.amazonaws.com/${filePath}`;
    return filePath;
  }
  return `http://${process.env.HOSTNAME}:${process.env.PORT}/${filePath}`;
};
