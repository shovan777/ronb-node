import { PaginateAdmin } from '@app/shared/common/pagination/fetch-pagination-response';
import { Author as Doner } from '@app/shared/entities/users.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BloodBankDonerListResponse extends PaginateAdmin<Doner>(Doner) {}

@ObjectType()
export class BloodRecordResponse {
  @Field()
  totalRequest: number;

  @Field()
  totalDonation: number;
}
