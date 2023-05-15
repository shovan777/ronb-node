import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { ErrorLoggerInterceptor } from '@app/shared/common/interceptors/errorlogger.interceptor';
import { SecurityMiddleware } from '@app/shared/common/middlewares/security.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));
  app.use(cookieParser());
  app.use(await new SecurityMiddleware().use);
  // implment global validation pipeline for explicit transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ErrorLoggerInterceptor());
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}
bootstrap();
