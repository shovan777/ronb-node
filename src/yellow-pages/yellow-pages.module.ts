import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  YellowPagesAddress,
  YellowPagesPhoneNumber,
  YellowPages,
  YellowPagesCatgory,
  District,
  Province,
  YellowPagesEmail,
} from './entities/yellow-pages.entity';
import {
  DistrictResolver,
  ProvinceResolver,
  YellowPagesAddressResolver,
  YellowPagesCategoryResolver,
  YellowPagesEmailResolver,
  YellowPagesPhoneNumberResolver,
  YellowPagesResolver,
} from './yellow-pages.resolver';
import {
  DistrictService,
  ProvinceService,
  YellowPagesAddressService,
  YellowPagesCategoryService,
  YellowPagesEmailService,
  YellowPagesPhoneNumberService,
  YellowPagesService,
} from './yellow-pages.service';

@Module({
  providers: [
    YellowPagesResolver,
    YellowPagesService,
    YellowPagesCategoryResolver,
    YellowPagesCategoryService,
    YellowPagesAddressResolver,
    YellowPagesAddressService,
    ProvinceService,
    ProvinceResolver,
    DistrictService,
    DistrictResolver,
    YellowPagesPhoneNumberResolver,
    YellowPagesPhoneNumberService,
    YellowPagesEmailResolver,
    YellowPagesEmailService
  ],
  imports: [
    TypeOrmModule.forFeature([
      YellowPages,
      YellowPagesCatgory,
      YellowPagesAddress,
      District,
      Province,
      YellowPagesPhoneNumber,
      YellowPagesEmail,
    ]),
  ],
  exports: [YellowPagesService],
})
export class YellowPagesModule {}
