import { ObjectType } from "@nestjs/graphql";
import { PaginateAdmin } from "../common/pagination/fetch-pagination-response";
import relayTypes from "../common/pagination/types/relay.types";
import { PublicToilet } from "./entities/public-toilet.entity";

@ObjectType()
export class PublicToiletResponse extends relayTypes<PublicToilet>(PublicToilet) {}

@ObjectType()
export class PublicToiletAdminResponse extends PaginateAdmin<PublicToilet>(PublicToilet) {}