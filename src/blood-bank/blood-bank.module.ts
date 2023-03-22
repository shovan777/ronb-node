import { Module } from '@nestjs/common';
import { BloodBankService } from './blood-bank.service';
import { BloodBankResolver } from './blood-bank.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BloodRequest,
  BloodRequestAddress,
} from './entities/blood-bank.entity';
import { BaseDistrict, BaseProvince } from 'src/common/entities/base.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [BloodBankService, BloodBankResolver],
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
      BloodRequestAddress,
      BaseDistrict,
      BaseProvince,
    ]),
    UsersModule,
  ],
  exports: [BloodBankService],
})
export class BloodBankModule {}
