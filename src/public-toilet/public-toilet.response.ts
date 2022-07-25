import { ObjectType } from "@nestjs/graphql";
import relayTypes from "src/common/pagination/types/relay.types";
import { PublicToilet } from "./entities/public-toilet.entity";

@ObjectType()
export default class PublicToiletResponse extends relayTypes<PublicToilet>(PublicToilet) {}