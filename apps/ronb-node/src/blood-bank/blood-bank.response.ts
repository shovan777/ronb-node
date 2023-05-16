import { PaginateAdmin } from '@app/shared/common/pagination/fetch-pagination-response';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { BloodRequest } from '@app/shared/entities/blood-bank.entity';
import { Author as Doner } from '@app/shared/entities/users.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BloodRequestAdminResponse extends PaginateAdmin<BloodRequest>(
  BloodRequest,
) {}

@ObjectType()
export class BloodRequestResponse extends relayTypes<BloodRequest>(
  BloodRequest,
) {}

@ObjectType()
export class BloodBankDonerListResponse extends PaginateAdmin<Doner>(Doner) {}

@ObjectType()
export class BloodRecordResponse {
  @Field()
  totalRequest: number;

  @Field()
  totalDonation: number;
}
