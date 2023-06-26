import { NEWS_PACKAGE_NAME } from '@app/shared/common/proto/news.pb';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NewscacheModule } from './newscache.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   NewscacheModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: 'localhost',
  //       port: 4000,
  //     },
  //   },
  // );
  const app = await NestFactory.create(NewscacheModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.NEWSCACHE_URL,
      package: NEWS_PACKAGE_NAME,
      protoPath: join(
        process.cwd(),
        'dist/libs/shared/common/proto/news.proto',
      ),
      // host: 'localhost',
      // port: 4000,
    },
  });
  await app.startAllMicroservices();
  // await app.listen(3001);
  // await app.listen();
}
bootstrap();
