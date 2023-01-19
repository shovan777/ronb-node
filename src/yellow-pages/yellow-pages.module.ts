import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  YellowPagesAddress,
  YellowPagesPhoneNumber,
  YellowPages,
  YellowPagesCatgory,
} from './entities/yellow-pages.entity';
import {
  YellowPagesAddressResolver,
  YellowPagesCategoryResolver,
  YellowPagesPhoneNumberResolver,
  YellowPagesResolver,
} from './yellow-pages.resolver';
import {
  YellowPagesAddressService,
  YellowPagesCategoryService,
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
    YellowPagesPhoneNumberResolver,
    YellowPagesPhoneNumberService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      YellowPages,
      YellowPagesCatgory,
      YellowPagesAddress,
      YellowPagesPhoneNumber,
    ]),
  ],
  exports: [YellowPagesService],
})
export class YellowPagesModule {}
