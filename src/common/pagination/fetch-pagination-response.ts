import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function PaginateAdmin<T>(ItemType: Type<T>): any {
    @ObjectType({ isAbstract: true})
    abstract class PageClass {
        @Field(() => [ItemType])
        data: T[]

        @Field(() => Int)
        count: number
    }

    return PageClass
}