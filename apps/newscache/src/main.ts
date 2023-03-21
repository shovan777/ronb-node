import { NestFactory } from '@nestjs/core';
import { NewscacheModule } from './newscache.module';

async function bootstrap() {
  const app = await NestFactory.create(NewscacheModule);
  await app.listen(4000);
}
bootstrap();
