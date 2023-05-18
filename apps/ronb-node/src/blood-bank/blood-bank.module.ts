import { Module } from '@nestjs/common';
import { BloodBankService } from './blood-bank.service';
import { BloodBankResolver } from './blood-bank.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BloodRequest,
  BloodRequestAddress,
} from '@app/shared/entities/blood-bank.entity';

import {
  BaseDistrict,
  BaseProvince,
} from '@app/shared/common/entities/base.entity';
import { UsersModule } from '../users/users.module';
import { BloodRequestSubsriber } from './blood-bank.subscriber';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  providers: [BloodBankService, BloodBankResolver, BloodRequestSubsriber],
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
      BloodRequestAddress,
      BaseDistrict,
      BaseProvince,
    ]),
    UsersModule,
    NotificationsModule,
  ],
  exports: [BloodBankService],
})
export class BloodBankModule {}
