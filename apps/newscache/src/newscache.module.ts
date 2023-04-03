import { SharedModule } from '@app/shared';
import { News } from '@app/shared/entities/news.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewscacheController } from './newscache.controller';
import { NewscacheService } from './newscache.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    // AppModule,
    SharedModule,
    TypeOrmModule.forFeature([News]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [NewscacheController],
  providers: [NewscacheService],
})
export class NewscacheModule {}
