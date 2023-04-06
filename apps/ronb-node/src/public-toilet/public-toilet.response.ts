import { ObjectType } from '@nestjs/graphql';
import { PaginateAdmin } from '@app/shared/common/pagination/fetch-pagination-response';
import relayTypes from '@app/shared/common/pagination/types/relay.types';
import { PublicToilet } from '@app/shared/entities/public-toilet.entity';

@ObjectType()
export class PublicToiletResponse extends relayTypes<PublicToilet>(
  PublicToilet,
) {}

@ObjectType()
export class PublicToiletAdminResponse extends PaginateAdmin<PublicToilet>(
  PublicToilet,
) {}
