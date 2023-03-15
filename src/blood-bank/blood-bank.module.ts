import { Module } from '@nestjs/common';
import { BloodBankService } from './blood-bank.service';
import { BloodBankResolver } from './blood-bank.resolver';

@Module({
  providers: [BloodBankService, BloodBankResolver],
  imports: [],
  exports: [],
})
export class BloodBankModule {}
