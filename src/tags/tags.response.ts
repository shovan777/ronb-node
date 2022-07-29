import { ObjectType } from "@nestjs/graphql";
import relayTypes from "src/common/pagination/types/relay.types";
import { Tag } from "./entities/tag.entity";

@ObjectType()
export default class TagsResponse extends relayTypes<Tag>(Tag) {}